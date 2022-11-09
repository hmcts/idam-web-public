package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EJUDICIARY_AAD;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.MOJ;

@Component
public class SSOService {

    public static final Map<String, String> SSO_LOGIN_HINTS =
        ImmutableMap.of(EJUDICIARY_AAD, "/oauth2/authorization/oidc",
            MOJ, "/oauth2/authorization/moj");
    public static final Map<String, String> SSO_IDAM_API_PROVIDER_MAP =
        ImmutableMap.of("azure", EJUDICIARY_AAD,
            "moj", MOJ);
    public static final String LOGIN_HINT_PARAM = "login_hint";
    public static final String PROVIDER_ATTR = "provider";

    private final ConfigurationProperties configurationProperties;

    @Autowired
    public SSOService(ConfigurationProperties configurationProperties) {
        this.configurationProperties = configurationProperties;
    }

    public boolean isSSOEmail(@NotNull final String username) {
        final String emailDomain = extractEmailDomain(username);
        return getSsoEmailDomains()
            .keySet()
            .stream()
            .anyMatch(domain -> domain.equalsIgnoreCase(emailDomain));
    }

    protected Map<String, String> getSsoEmailDomains() {
        return configurationProperties.getSsoEmailDomains();
    }

    private String extractEmailDomain(@NotNull final String username) {
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
    public void redirectToExternalProvider(@NotNull final HttpServletRequest request, @NotNull final HttpServletResponse response) throws IOException {
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
    public void redirectToExternalProvider(@NotNull final HttpServletRequest request, @NotNull final HttpServletResponse response, @NotNull final String loginEmail) throws IOException {
        redirectToExternalProvider(request, response, false, loginEmail);
    }

    private void redirectToExternalProvider(@NotNull final HttpServletRequest request,
                                            @NotNull final HttpServletResponse response,
                                            final boolean reuseExistingSession,
                                            final String loginEmail) throws IOException {

        final String provider = computeProviderSessionAttribute(request, reuseExistingSession,
            loginEmail, request.getParameter(LOGIN_HINT_PARAM));

        final Map<String, String[]> oidcParams = new HashMap<>(request.getParameterMap());
        if (!oidcParams.containsKey(LOGIN_HINT_PARAM)) {
            oidcParams.put(LOGIN_HINT_PARAM, new String[]{provider});
        }
        request.getSession().setAttribute("oidcParams", oidcParams);

        response.sendRedirect(SSO_LOGIN_HINTS.get(provider));
    }

    public String computeProviderSessionAttribute(HttpServletRequest request,
                                                  boolean reuseExistingSession,
                                                  String loginEmail,
                                                  String loginHintParam) {
        final HttpSession existingSession = request.getSession(false);
        boolean ssoSessionExists = existingSession != null && existingSession.getAttribute(PROVIDER_ATTR) != null;

        final String provider;

        if (loginHintParam != null && SSO_LOGIN_HINTS.containsKey(loginHintParam.toLowerCase())) {
            provider = loginHintParam.toLowerCase();
        } else if (reuseExistingSession && ssoSessionExists) {
            provider = existingSession.getAttribute(PROVIDER_ATTR).toString();
        } else {
            provider = getSsoEmailDomains().get(extractEmailDomain(loginEmail));
        }

        return provider;
    }
}
