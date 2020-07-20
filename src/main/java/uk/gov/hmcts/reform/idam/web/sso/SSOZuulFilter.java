package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@Component
public class SSOZuulFilter extends ZuulFilter {

    private static Map<String, String> ssoLoginHints
            = ImmutableMap.of("ejudiciary-aad", "/oauth2/authorization/oidc");

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

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
        return ssoLoginHints.containsKey(ctx.getRequest()
            .getParameter("login_hint").toLowerCase());
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        try {
            redirectStrategy.sendRedirect(ctx.getRequest(), ctx.getResponse(),
                ssoLoginHints.get(ctx.getRequest()
                .getParameter("login_hint").toLowerCase()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
