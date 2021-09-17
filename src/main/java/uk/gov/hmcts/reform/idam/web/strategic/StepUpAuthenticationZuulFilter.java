package uk.gov.hmcts.reform.idam.web.strategic;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.MvcKeys;
import uk.gov.hmcts.reform.idam.web.sso.SSOZuulFilter;

import javax.annotation.Nonnull;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;

import static com.netflix.zuul.constants.ZuulHeaders.X_FORWARDED_FOR;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@Slf4j
@Component
@ConditionalOnProperty("features.step-up-authentication") // NOSONAR
public class StepUpAuthenticationZuulFilter extends ZuulFilter {

    public static final String ZUUL_PROCESSING_ERROR = "Cannot process authentication response";
    public static final String OIDC_AUTHORIZE_ENDPOINT = "/o/authorize";
    private static final String PROMPT_PARAMETER = "prompt";
    private static final String PROMPT_LOGIN_VALUE = "login";

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

    /**
     * {@inheritDoc}
     *
     * <p>Makes sure it runs AFTER the {@link SSOZuulFilter}.</p>
     *
     * @return
     */
    @Override
    public int filterOrder() {
        return SSOZuulFilter.FILTER_ORDER + 1;
    }

    @Override
    public boolean shouldFilter() {
        final HttpServletRequest request = RequestContext.getCurrentContext().getRequest();
        return isAuthorizeRequest(request) && hasSessionCookie(request) && !isPromptLogin(request);
    }

    @Override
    public Object run() {
        final RequestContext ctx = RequestContext.getCurrentContext();
        final HttpServletRequest request = ctx.getRequest();

        log.info("StepUp filter triggered.");

        final String tokenId = getSessionToken(request);
        final String originIp = ObjectUtils.defaultIfNull(request.getHeader(X_FORWARDED_FOR), request.getRemoteAddr());
        final String redirectUri = request.getParameter(MvcKeys.REDIRECT_URI);
        final ApiAuthResult authenticationResult = spiService.authenticate(tokenId, redirectUri, originIp);

        if (authenticationResult.requiresMfa()) {
            dropCookie(idamSessionCookieName, ctx);
        }

        // continue as usual (delegate to idam-api)
        ctx.setSendZuulResponse(true);
        return null;
    }

    protected void dropCookie(@Nonnull final String cookieName, @Nonnull final RequestContext context) {
        context.addZuulRequestHeader(HttpHeaders.COOKIE, cookieName + "=");
    }

    protected String getSessionToken(@Nonnull final HttpServletRequest request) {
        return Arrays.stream(getCookiesFromRequest(request))
            .filter(cookie -> idamSessionCookieName.equals(cookie.getName()))
            .map(Cookie::getValue)
            .findAny()
            .orElseThrow();
    }

    protected boolean isAuthorizeRequest(@Nonnull final HttpServletRequest request) {
        return request.getRequestURI().contains(OIDC_AUTHORIZE_ENDPOINT) &&
            ("post".equalsIgnoreCase(request.getMethod()) || "get".equalsIgnoreCase(request.getMethod()));
    }

    protected boolean isPromptLogin(HttpServletRequest request) {
        String promptValue = request.getParameter(PROMPT_PARAMETER);
        return StringUtils.isNotEmpty(promptValue) && promptValue.equals(PROMPT_LOGIN_VALUE);
    }

    protected boolean hasSessionCookie(@Nonnull final HttpServletRequest request) {
        return Arrays.stream(getCookiesFromRequest(request)).anyMatch(cookie -> idamSessionCookieName.equals(cookie.getName()));
    }

    @Nonnull
    protected Cookie[] getCookiesFromRequest(@Nonnull final HttpServletRequest request) {
        return Optional.ofNullable(request.getCookies()).orElse(new Cookie[]{});
    }
}
