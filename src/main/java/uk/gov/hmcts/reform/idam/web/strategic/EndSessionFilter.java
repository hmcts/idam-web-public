package uk.gov.hmcts.reform.idam.web.strategic;

import com.google.common.net.HttpHeaders;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.POST_TYPE;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_RESPONSE_FILTER_ORDER;

@Component
public class EndSessionFilter extends ZuulFilter {

    private static final String OIDC_END_SESSION_ENDPOINT = "/o/endSession";

    private final String idamSessionCookieName;

    public EndSessionFilter(ConfigurationProperties configurationProperties) {
        this.idamSessionCookieName = configurationProperties.getStrategic().getSession().getIdamSessionCookie();
    }

    @Override
	public String filterType() {
		return POST_TYPE;
	}

	@Override
	public int filterOrder() {
		return SEND_RESPONSE_FILTER_ORDER - 1;
	}

	@Override
	public boolean shouldFilter() {
        final HttpServletRequest request = RequestContext.getCurrentContext().getRequest();
        return isEndSessionRequest(request);
	}

    @Override
	public Object run() {
        RequestContext context = RequestContext.getCurrentContext();
        HttpServletRequest httpRequest = context.getRequest();
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        HttpServletResponse servletResponse = context.getResponse();
        servletResponse.addHeader(HttpHeaders.SET_COOKIE, idamSessionCookieName
            + "=; Path=/; Expires=Thu, 01-Jan-1970 00:00:10 GMT; HttpOnly");

        return null;
	}

    private boolean isEndSessionRequest(HttpServletRequest request) {
        return request.getRequestURI().contains(OIDC_END_SESSION_ENDPOINT);
    }
}