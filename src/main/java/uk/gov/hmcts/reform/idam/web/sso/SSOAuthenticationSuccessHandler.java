package uk.gov.hmcts.reform.idam.web.sso;

import feign.Response;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpStatusCodeException;
import uk.gov.hmcts.reform.idam.web.client.OidcApi;
import uk.gov.hmcts.reform.idam.web.client.SsoFederationApi;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpHeaders.SET_COOKIE;
import static uk.gov.hmcts.reform.idam.web.helper.ErrorHelper.restException;

@Slf4j
public class SSOAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    private final OAuth2AuthorizedClientRepository repository;

    private final SsoFederationApi federationApi;

    private final OidcApi oidcApi;

    public SSOAuthenticationSuccessHandler(OAuth2AuthorizedClientRepository repository,
                                           SsoFederationApi federationApi, OidcApi oidcApi) {
        this.repository = repository;
        this.federationApi = federationApi;
        this.oidcApi = oidcApi;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response, Authentication authentication)
        throws IOException {

        handle(request, response, authentication);
        clearAuthenticationAttributes(request);
    }

    protected void handle(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {

        final OAuth2AuthorizedClient client = repository
            .loadAuthorizedClient(((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId(),
                authentication, request);

        final String access_token = client.getAccessToken().getTokenValue();
        String bearerToken = "Bearer " + access_token;

        updateOrCreateUser(bearerToken);

        String sessionCookie = federationApi.federationAuthenticate(bearerToken)
            .headers().get(SET_COOKIE).stream()
            .findAny().orElseThrow(() ->
                restException(null, HttpStatus.UNAUTHORIZED,  new HttpHeaders(),
                    HttpStatus.UNAUTHORIZED.getReasonPhrase(), "Unable to authenticate user.")
            );

        final Map<String, String[]> paramMap = (Map<String, String[]>) request.getSession()
            .getAttribute("oidcParams");

        if (CollectionUtils.isEmpty(paramMap)) {
            request.getSession().invalidate();
            throw restException(null, HttpStatus.FORBIDDEN, new HttpHeaders(),
                HttpStatus.FORBIDDEN.getReasonPhrase(), "Only federated logins allowed.");
        }

        final String responseUrl = authoriseUser(Collections.singletonList(sessionCookie), paramMap);

        if (response.isCommitted()) {
            throw restException(null, HttpStatus.INTERNAL_SERVER_ERROR, new HttpHeaders(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Response has already been committed. Unable to redirect.");
        }

        clearAuthenticationAttributes(request);

        if (!responseUrl.contains("error")) {
            response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie);
        }

        redirectStrategy.sendRedirect(request, response, responseUrl);
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }

    private void updateOrCreateUser(String bearerToken) {
        try {
            federationApi.updateFederatedUser(bearerToken);
        } catch (HttpStatusCodeException e) {
            if (HttpStatus.NOT_FOUND.equals(e.getStatusCode())) {
                federationApi.createFederatedUser(bearerToken);
            }
            throw e;
        }
    }

    private String authoriseUser(List<String> cookies, Map<String, String[]> paramMap) {
        Map<String, Object> params = new HashMap<>();

        paramMap.forEach((key, values) -> {
                if (values.length > 0 && !String.join(" ", values).trim().isEmpty())
                    params.put(key, String.join(" ", values));
            }
        );

        params.remove("login_hint");

        Response response = oidcApi.oauth2AuthorizePost(
            StringUtils.join(cookies, ";"),
            params
        );

        return response.headers().get(HttpHeaders.LOCATION)
            .stream().findAny().orElseThrow(() -> restException(null, HttpStatus.FORBIDDEN, new HttpHeaders(),
            HttpStatus.FORBIDDEN.getReasonPhrase(), "The server did not respond with the expected response."));
    }
}