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
import java.util.Set;

import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EJUDICIARY_AAD;

@UtilityClass
public class SSOHelper {

    public final Map<String, String> SSO_LOGIN_HINTS = ImmutableMap.of(EJUDICIARY_AAD, "/oauth2/authorization/oidc");
    public final String LOGIN_HINT_PARAM = "login_hint";
    public final String PROVIDER_ATTR = "provider";

    // fixme - externalise
    public final Set<String> SSO_DOMAINS = Set.of("gmail.com");

    public boolean isSSOEmail(@NonNull final String username) {
        return SSO_DOMAINS.contains(StringUtils.substringAfterLast(username, "@"));
    }

    public void redirectToExternalProvider(@NonNull final HttpServletRequest request, @NonNull final HttpServletResponse response) throws IOException {
        redirectToExternalProvider(request, response, true);
    }

    public void redirectToExternalProvider(@NonNull final HttpServletRequest request, @NonNull final HttpServletResponse response, final boolean reuseExistingSession) throws IOException {

        final HttpSession existingSession = reuseExistingSession ? request.getSession(false) : null;
        boolean ssoSessionExists = existingSession != null && existingSession.getAttribute(PROVIDER_ATTR) != null;
        final String provider = ssoSessionExists ?
            existingSession.getAttribute(PROVIDER_ATTR).toString() :
            request.getParameter(LOGIN_HINT_PARAM).toLowerCase();

        if (!ssoSessionExists) {
            request.getSession().setAttribute(PROVIDER_ATTR, request.getParameter(LOGIN_HINT_PARAM).toLowerCase());
        }

        response.sendRedirect(SSO_LOGIN_HINTS.get(provider));
    }
}
