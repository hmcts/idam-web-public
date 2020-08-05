package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EJUDICIARY_AAD;

@Component
public class SSOZuulFilter extends ZuulFilter {

    private static final Map<String, String> ssoLoginHints
        = ImmutableMap.of(EJUDICIARY_AAD, "/oauth2/authorization/oidc");

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
        boolean existingSSOSession = session != null && session.getAttribute("provider") != null;
        boolean ssoLoginInstruction = ctx.getRequest().getParameter("login_hint") != null
            && ssoLoginHints.containsKey(ctx.getRequest()
            .getParameter("login_hint").toLowerCase());
        return existingSSOSession || ssoLoginInstruction;
    }

    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        try {
            HttpServletRequest request = ctx.getRequest();
            HttpSession existingSession = ctx.getRequest().getSession(false);

            boolean existingSSOSession = existingSession != null
                && existingSession.getAttribute("provider") != null;

            request.getSession().setAttribute("oidcParams", request.getParameterMap());
            ctx.setSendZuulResponse(false);

            if (existingSSOSession) {
                ctx.getResponse().sendRedirect(ssoLoginHints
                    .get(existingSession.getAttribute("provider").toString()));
            } else {
                request.getSession().setAttribute("provider",
                    request.getParameter("login_hint").toLowerCase());
                ctx.getResponse().sendRedirect(ssoLoginHints
                    .get(request.getParameter("login_hint").toLowerCase()));
            }
        } catch (IOException e) {
            throw new ZuulException(e, 500, "Unable to redirect to provider: " + e.getMessage());
        }

        return null;
    }
}
