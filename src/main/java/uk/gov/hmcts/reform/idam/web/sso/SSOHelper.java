package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import lombok.NonNull;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EJUDICIARY_AAD;

@UtilityClass
public class SSOHelper {

    public final Map<String, String> SSO_LOGIN_HINTS = ImmutableMap.of(EJUDICIARY_AAD, "/oauth2/authorization/oidc");
    public final String LOGIN_HINT_PARAM = "login_hint";
    public final String PROVIDER_ATTR = "provider";

    // fixme - externalise
    public final Map<String, String> SSO_DOMAINS = Map.of("test.com", EJUDICIARY_AAD);

    public boolean isSSOEmail(@NonNull final String username) {
        return SSO_DOMAINS.containsKey(extractEmailDomain(username));
    }

    private String extractEmailDomain(@NonNull final String username) {
        return StringUtils.substringAfterLast(username, "@");
    }

    /**
     * Redirects to the external provider. Takes the SSO provider from existing session if possible.
     *
     * @param request
     * @param response
     *
     * @throws IOException
     */
    public void redirectToExternalProvider(@NonNull final HttpServletRequest request, @NonNull final HttpServletResponse response) throws IOException {
        redirectToExternalProvider(request, response, true, null);
    }

    /**
     * Redirects to the external provider. Assumes the SSO provider based on user login (email).
     *
     * @param request
     * @param response
     * @param loginEmail
     *
     * @throws IOException
     */
    public void redirectToExternalProvider(@NonNull final HttpServletRequest request, @NonNull final HttpServletResponse response, @NonNull final String loginEmail) throws IOException {
        redirectToExternalProvider(request, response, false, loginEmail);
    }

    private void redirectToExternalProvider(@NonNull final HttpServletRequest request,
                                            @NonNull final HttpServletResponse response,
                                            final boolean reuseExistingSession,
                                            final String loginEmail) throws IOException {

        final HttpSession existingSession = request.getSession(false);
        boolean ssoSessionExists = existingSession != null && existingSession.getAttribute(PROVIDER_ATTR) != null;

        final String provider;

        if (reuseExistingSession && ssoSessionExists) {
            provider = existingSession.getAttribute(PROVIDER_ATTR).toString();
        } else {
            if (loginEmail != null) {
                provider = SSO_DOMAINS.get(extractEmailDomain(loginEmail));
            } else {
                provider = request.getParameter(LOGIN_HINT_PARAM).toLowerCase();
            }
        }

        if (!ssoSessionExists) {
            request.getSession().setAttribute(PROVIDER_ATTR, provider);
        }

        response.sendRedirect(SSO_LOGIN_HINTS.get(provider));
    }
}
