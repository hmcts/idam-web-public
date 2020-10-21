package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import javax.annotation.Nonnull;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Optional;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@Slf4j
@Component
public class StepUpAuthenticationZuulFilter extends ZuulFilter {

    private ConfigurationProperties configurationProperties;
    private SPIService spiService;
    private final String idamSessionCookieName;

    @Autowired
    public StepUpAuthenticationZuulFilter(@Nonnull final ConfigurationProperties configurationProperties, @Nonnull final SPIService spiService) {
        this.configurationProperties = configurationProperties;
        this.idamSessionCookieName = configurationProperties.getStrategic().getSession().getIdamSessionCookie();
        this.spiService = spiService;
    }

    @Override
    public String filterType() {
        return PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        final RequestContext ctx = RequestContext.getCurrentContext();
        final HttpServletRequest request = ctx.getRequest();
        final boolean isAuthorizeRequest = request.getRequestURI().contains("/o/authorize") && "post".equalsIgnoreCase(request.getMethod());

        if (!isAuthorizeRequest) {
            return false;
        }

        final boolean hasSessionCookie = Arrays.stream(getCookiesFromRequest(request)).anyMatch(cookie -> idamSessionCookieName.equals(cookie.getName()));

        return hasSessionCookie;
    }

    @Override
    public Object run() throws ZuulException {
        final RequestContext ctx = RequestContext.getCurrentContext();
        final HttpServletRequest request = ctx.getRequest();

        log.info("StepUp filter triggered. Method={}, URI={}", request.getMethod(), request.getRequestURI());

        final String tokenId = Arrays.stream(getCookiesFromRequest(request))
            .filter(cookie -> idamSessionCookieName.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findAny()
            .orElseThrow();

        final URI redirectUri;
        try {
            final URIBuilder redirectUriBuilder = new URIBuilder().setPath("/login");
            copyRequestParameters(redirectUriBuilder, request);
            redirectUri = redirectUriBuilder.build();
        } catch (final URISyntaxException e) {
            throw zuulError("Cannot generate redirectUri");
        }

        //todo
        final String originIp = "";
        try {
            final ApiAuthResult authenticationResult = spiService.authenticate(tokenId, redirectUri.toString(), originIp);
            if (!authenticationResult.isSuccess()) {
                throw zuulError("Authentication failed: " + authenticationResult.getErrorCode().name());
            }
            // redirect to the login page for re-authentication
            if (authenticationResult.requiresMfa()) {
                ctx.setResponseStatusCode(HttpServletResponse.SC_MOVED_TEMPORARILY);
                ctx.getResponse().addHeader(HttpHeaders.LOCATION, redirectUri.toString());
                return null;
            }
            // continue as usual
            ctx.setSendZuulResponse(true);
            return null;
        } catch (JsonProcessingException e) {
            log.error("Cannot process authentication response", e);
            throw zuulError("Cannot process authentication response");
        }
    }

    protected void copyRequestParameters(URIBuilder uriBuilder, HttpServletRequest originalRequest) {
        originalRequest.getParameterMap().forEach((key, parameterValues) -> {
            if (parameterValues != null) {
                for (final String parameterValue : parameterValues) {
                    uriBuilder.addParameter(key, parameterValue);
                }
            }
        });
    }

    @Nonnull
    private ZuulException zuulError(@Nonnull final String errorCause) {
        return new ZuulException("StepUp authentication failed", HttpServletResponse.SC_INTERNAL_SERVER_ERROR, errorCause);
    }

    @Nonnull
    private Cookie[] getCookiesFromRequest(@Nonnull final HttpServletRequest request) {
        return Optional.ofNullable(request.getCookies()).orElse(new Cookie[]{});
    }
}
