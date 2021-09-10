package uk.gov.hmcts.reform.idam.web.sso;

import com.google.common.collect.ImmutableMap;
import feign.Request;
import feign.Response;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.web.client.HttpStatusCodeException;
import uk.gov.hmcts.reform.idam.web.client.OidcApi;
import uk.gov.hmcts.reform.idam.web.client.SsoFederationApi;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.AuthHelper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpHeaders.LOCATION;
import static org.springframework.http.HttpHeaders.SET_COOKIE;
import static uk.gov.hmcts.reform.idam.web.helper.ErrorHelper.restException;

@RunWith(MockitoJUnitRunner.class)
public class SSOAuthenticationSuccessHandlerTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private OAuth2AuthenticationToken authentication;

    @Mock
    private OAuth2AuthorizedClientRepository repository;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private SsoFederationApi federationApi;

    @Mock
    private OidcApi oidcApi;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private OAuth2AuthorizedClient client;

    @Mock
    private StrategicConfigurationProperties.Session sessionProperties;

    @Mock
    private HttpSession session;

    @Mock
    private AuthHelper authHelper;

    private SSOAuthenticationSuccessHandler underTest;

    @Before
    public void setUp() {
        given(repository.loadAuthorizedClient(any(), any(), any())).willReturn(client);
        given(client.getAccessToken().getTokenValue()).willReturn("an_access_token");
        given(sessionProperties.getIdamSessionCookie()).willReturn("Idam.Session");
        underTest = new SSOAuthenticationSuccessHandler(repository, federationApi, oidcApi, sessionProperties, authHelper);
    }

    @Test
    public void onAuthenticationSuccess_shouldJustWorkBecauseIHaveMockedEverything() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        final Map<String, String[]> paramMap = ImmutableMap.of("some_param", new String[] {"some_value"});
        Map<String, Collection<String>> feignHeaders = ImmutableMap.of(LOCATION, List.of("http://some_url"));
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(paramMap);
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        Response feignResponse2 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(feignHeaders).build();
        given(oidcApi.oauth2AuthorizePost(any(), any())).willReturn(feignResponse2);
        underTest.onAuthenticationSuccess(request, response, authentication);
        verify(response, atLeastOnce()).sendRedirect(any());
    }

    @Test
    public void onAuthenticationSuccess_shouldCallCreateInsteadOfUpdate() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        final Map<String, String[]> paramMap = ImmutableMap.of("some_param", new String[] {"some_value"});
        Map<String, Collection<String>> feignHeaders = ImmutableMap.of(LOCATION, List.of("http://some_url"));
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(paramMap);
        given(federationApi.updateFederatedUser(anyString()))
            .willThrow(restException("", HttpStatus.NOT_FOUND, new HttpHeaders(), null));
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        Response feignResponse2 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(feignHeaders).build();
        given(oidcApi.oauth2AuthorizePost(any(), any())).willReturn(feignResponse2);
        underTest.onAuthenticationSuccess(request, response, authentication);
        verify(federationApi, atLeastOnce()).createFederatedUser(anyString());
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfResponseIsCommittee() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        final Map<String, String[]> paramMap = ImmutableMap.of("some_param", new String[] {"some_value"});
        Map<String, Collection<String>> feignHeaders = ImmutableMap.of(LOCATION, List.of("http://some_url"));
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(paramMap);
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        Response feignResponse2 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(feignHeaders).build();
        given(oidcApi.oauth2AuthorizePost(any(), any())).willReturn(feignResponse2);
        given(response.isCommitted()).willReturn(true);
        underTest.onAuthenticationSuccess(request, response, authentication);
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfUpdateOrCreateThrowsError() throws IOException {
        given(federationApi.updateFederatedUser(anyString()))
            .willThrow(restException("", HttpStatus.INTERNAL_SERVER_ERROR, new HttpHeaders(), null));
        underTest.onAuthenticationSuccess(request, response, authentication);
    }

    @Test
    public void onAuthenticationSuccess_shouldRedirectToLoginOnForbidden() throws IOException {
        given(federationApi.updateFederatedUser(anyString()))
            .willThrow(restException("", HttpStatus.FORBIDDEN, new HttpHeaders(), null));
        underTest.onAuthenticationSuccess(request, response, authentication);
        verify(response, atLeastOnce()).sendRedirect(any());
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfLocationHeaderIsEmpty() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        final Map<String, String[]> paramMap = ImmutableMap.of("some_param", new String[] {"some_value"});
        Map<String, Collection<String>> feignHeaders = ImmutableMap.of(LOCATION, Collections.emptyList());
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(paramMap);
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        Response feignResponse2 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(feignHeaders).build();
        given(oidcApi.oauth2AuthorizePost(any(), any())).willReturn(feignResponse2);
        underTest.onAuthenticationSuccess(request, response, authentication);
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfLocationHeaderIsMissing() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        final Map<String, String[]> paramMap = ImmutableMap.of("some_param", new String[] {"some_value"});
        Map<String, Collection<String>> feignHeaders = Collections.emptyMap();
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(paramMap);
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        Response feignResponse2 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(feignHeaders).build();
        given(oidcApi.oauth2AuthorizePost(any(), any())).willReturn(feignResponse2);
        underTest.onAuthenticationSuccess(request, response, authentication);
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfParamMapIsMissing() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, List.of("Idam.Session=abcdefg"));
        Map<String, Collection<String>> feignHeaders = Collections.emptyMap();
        given(request.getSession()).willReturn(session);
        given(session.getAttribute(anyString())).willReturn(Collections.emptyMap());
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        underTest.onAuthenticationSuccess(request, response, authentication);
    }

    @Test(expected = HttpStatusCodeException.class)
    public void onAuthenticationSuccess_shouldThrowExceptionIfNoSessionCookieExists() throws IOException {
        Map<String, Collection<String>> headers = ImmutableMap.of(SET_COOKIE, Collections.emptyList());
        Map<String, Collection<String>> feignHeaders = Collections.emptyMap();
        Response feignResponse1 = Response.builder()
            .request(Request.create(Request.HttpMethod.CONNECT, "some_url", feignHeaders, (Request.Body) null, null))
            .headers(headers).build();
        given(federationApi.federationAuthenticate(anyString())).willReturn(feignResponse1);
        underTest.onAuthenticationSuccess(request, response, authentication);
    }
}