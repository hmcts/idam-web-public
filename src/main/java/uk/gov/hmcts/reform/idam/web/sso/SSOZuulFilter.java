package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@Component
public class SSOZuulFilter extends ZuulFilter {

    private static final Map<String, String> ssoLoginHints
        = ImmutableMap.of("ejudiciary-aad", "/oauth2/authorization/oidc");

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
        return ctx.getRequest().getParameter("login_hint") != null
            && ssoLoginHints.containsKey(ctx.getRequest()
                .getParameter("login_hint").toLowerCase());
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        try {
            HttpServletRequest request = ctx.getRequest();
            request.getSession().setAttribute("oidcParams", request.getParameterMap());
            ctx.setSendZuulResponse(false);
            ctx.getResponse().sendRedirect(ssoLoginHints.get(request.getParameter("login_hint").toLowerCase()));
        } catch (IOException e) {
            throw new ZuulException(e, 500, "Unable to redirect to provider: " + e.getMessage());
        }

        return null;
    }
}
