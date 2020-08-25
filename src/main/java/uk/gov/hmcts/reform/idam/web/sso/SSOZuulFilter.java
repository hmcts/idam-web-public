package uk.gov.hmcts.reform.idam.web.sso;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;
import static uk.gov.hmcts.reform.idam.web.sso.SSOHelper.*;

@Component
public class SSOZuulFilter extends ZuulFilter {

    private final ConfigurationProperties configurationProperties;

    @Autowired
    public SSOZuulFilter(final ConfigurationProperties configurationProperties) {
        this.configurationProperties = configurationProperties;
    }

    @Override
    public String filterType() {
        return PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpSession session = ctx.getRequest().getSession(false);
        boolean existingSSOSession = session != null && session.getAttribute(PROVIDER_ATTR) != null;
        boolean ssoLoginInstruction = ctx.getRequest().getParameter(LOGIN_HINT_PARAM) != null
            && SSO_LOGIN_HINTS.containsKey(ctx.getRequest().getParameter(LOGIN_HINT_PARAM).toLowerCase());
        return existingSSOSession || (ssoLoginInstruction && isSSOEnabled());
    }

    protected boolean isSSOEnabled() {
        return configurationProperties.getFeatures().isFederatedSSO();
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        request.getSession().setAttribute("oidcParams", request.getParameterMap());
        ctx.setSendZuulResponse(false);

        try {
            SSOHelper.redirectToExternalProvider(request, ctx.getResponse());
        } catch (IOException e) {
            throw new ZuulException(e, 500, "Unable to redirect to provider: " + e.getMessage());
        }

        return null;
    }
}
