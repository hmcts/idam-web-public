package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.http.HttpHeaders;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.MvcKeys;

import javax.annotation.Nonnull;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Optional;

import static com.netflix.zuul.constants.ZuulHeaders.X_FORWARDED_FOR;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@Slf4j
@Component
public class StepUpAuthenticationZuulFilter extends ZuulFilter {

    public static final String ZUUL_PROCESSING_ERROR = "Cannot process authentication response";

    private final SPIService spiService;
    private final String idamSessionCookieName;

    @Autowired
    public StepUpAuthenticationZuulFilter(@Nonnull final ConfigurationProperties configurationProperties, @Nonnull final SPIService spiService) {
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
        final HttpServletRequest request = RequestContext.getCurrentContext().getRequest();
        return isAuthorizeRequest(request) && hasSessionCookie(request);
    }


    @Override
    public Object run() throws ZuulException {
        final RequestContext ctx = RequestContext.getCurrentContext();
        final HttpServletRequest request = ctx.getRequest();

        log.info("StepUp filter triggered.");

        final String tokenId = getSessionToken(request);

        final URI loginRedirectUri;
        try {
            final URIBuilder redirectUriBuilder = new URIBuilder().setPath("/login");
            copyRequestParameters(redirectUriBuilder, request);
            loginRedirectUri = redirectUriBuilder.build();
        } catch (final URISyntaxException e) {
            throw zuulError("Cannot generate loginRedirectUri");
        }

        try {
            final String originIp = ObjectUtils.defaultIfNull(request.getHeader(X_FORWARDED_FOR), request.getRemoteAddr());
            final String redirectUri = request.getParameter(MvcKeys.REDIRECT_URI);
            final ApiAuthResult authenticationResult = spiService.authenticate(tokenId, redirectUri, originIp);
            if (!authenticationResult.isSuccess()) {
                throw zuulError("Authentication failed: " + authenticationResult.getErrorCode().name());
            }
            // redirect to the login page for re-authentication
            if (authenticationResult.requiresMfa()) {
                ctx.setResponseStatusCode(HttpServletResponse.SC_MOVED_TEMPORARILY);
                ctx.getResponse().setHeader(HttpHeaders.LOCATION, loginRedirectUri.toString());
                ctx.setSendZuulResponse(false);
                return null;
            }
            // continue as usual
            ctx.setSendZuulResponse(true);
            return null;
        } catch (final JsonProcessingException e) {
            log.error(ZUUL_PROCESSING_ERROR, e);
            throw zuulError(ZUUL_PROCESSING_ERROR);
        }
    }

    protected String getSessionToken(@Nonnull final HttpServletRequest request) {
        return Arrays.stream(getCookiesFromRequest(request))
            .filter(cookie -> idamSessionCookieName.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findAny()
            .orElseThrow();
    }

    protected boolean isAuthorizeRequest(@Nonnull final HttpServletRequest request) {
        return request.getRequestURI().contains("/o/authorize") && "post".equalsIgnoreCase(request.getMethod());
    }

    protected boolean hasSessionCookie(@Nonnull final HttpServletRequest request) {
        return Arrays.stream(getCookiesFromRequest(request)).anyMatch(cookie -> idamSessionCookieName.equals(cookie.getName()));
    }

    protected void copyRequestParameters(@Nonnull final URIBuilder uriBuilder, @Nonnull final HttpServletRequest originalRequest) {
        originalRequest.getParameterMap().forEach((key, values) -> {
            if (values != null) {
                for (final String value : values) {
                    uriBuilder.addParameter(key, value);
                }
            }
        });
    }

    @Nonnull
    protected ZuulException zuulError(@Nonnull final String errorCause) {
        return new ZuulException("StepUp authentication failed", HttpServletResponse.SC_UNAUTHORIZED, errorCause);
    }

    @Nonnull
    protected Cookie[] getCookiesFromRequest(@Nonnull final HttpServletRequest request) {
        return Optional.ofNullable(request.getCookies()).orElse(new Cookie[]{});
    }
}
