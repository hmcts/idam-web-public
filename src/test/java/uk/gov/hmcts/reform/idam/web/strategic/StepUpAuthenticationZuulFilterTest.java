package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.netflix.zuul.context.RequestContext;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.sso.SSOZuulFilter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@RunWith(MockitoJUnitRunner.class)
public class StepUpAuthenticationZuulFilterTest {

    private StepUpAuthenticationZuulFilter filter;
    private SPIService spiService;

    @Before
    public void setUp() {
        final ConfigurationProperties config = new ConfigurationProperties();
        final StrategicConfigurationProperties strategicProperties = new StrategicConfigurationProperties();
        final StrategicConfigurationProperties.Session session = new StrategicConfigurationProperties.Session();
        session.setIdamSessionCookie("Idam.Session");
        strategicProperties.setSession(session);
        config.setStrategic(strategicProperties);
        this.spiService = mock(SPIService.class);
        this.filter = spy(new StepUpAuthenticationZuulFilter(config, this.spiService));
    }

    @Test
    public void filterType() {
        assertEquals(PRE_TYPE, filter.filterType());
    }

    @Test
    public void filterOrder() {
        assertTrue(filter.filterOrder() > SSOZuulFilter.FILTER_ORDER);
    }

    @Test
    public void shouldFilter() {
        doReturn(true).when(filter).isAuthorizeRequest(any());
        doReturn(true).when(filter).hasSessionCookie(any());
        doReturn(false).when(filter).isPromptLogin(any());
        assertEquals(true, filter.shouldFilter());

        doReturn(true).when(filter).isAuthorizeRequest(any());
        doReturn(true).when(filter).hasSessionCookie(any());
        doReturn(true).when(filter).isPromptLogin(any());
        assertEquals(false, filter.shouldFilter());

        doReturn(true).when(filter).isAuthorizeRequest(any());
        doReturn(false).when(filter).hasSessionCookie(any());
        assertEquals(false, filter.shouldFilter());

        doReturn(false).when(filter).isAuthorizeRequest(any());
        assertEquals(false, filter.shouldFilter());

    }

    @Test
    public void isAuthorizeRequest() {
        final HttpServletRequest request = mock(HttpServletRequest.class);
        doReturn("http://localhost:1234/o/authorize").when(request).getRequestURI();
        doReturn("POST").when(request).getMethod();
        assertEquals(true, filter.isAuthorizeRequest(request));
        doReturn("http://localhost:1234/o/authorize").when(request).getRequestURI();
        doReturn("GET").when(request).getMethod();
        assertEquals(true, filter.isAuthorizeRequest(request));
        doReturn("http://localhost:1234/o/authorize").when(request).getRequestURI();
        doReturn("PUT").when(request).getMethod();
        assertEquals(false, filter.isAuthorizeRequest(request));
        doReturn("http://localhost:1234/login?param=1").when(request).getRequestURI();
        assertEquals(false, filter.isAuthorizeRequest(request));
        doReturn("http://localhost:1234/login?param=1").when(request).getRequestURI();
        assertEquals(false, filter.isAuthorizeRequest(request));
    }

    @Test
    public void hasSessionCookie() {
        final HttpServletRequest request = mock(HttpServletRequest.class);

        doReturn(new Cookie[]{}).when(request).getCookies();
        assertFalse(filter.hasSessionCookie(request));

        Cookie cookie = new Cookie("Idam.Session", "value");
        doReturn(new Cookie[]{cookie}).when(request).getCookies();
        assertTrue(filter.hasSessionCookie(request));
    }

    @Test
    public void getSessionToken() {
        final HttpServletRequest request = mock(HttpServletRequest.class);
        final String sessionCookieValue = "test";
        Cookie[] cookies = new Cookie[]{
            new Cookie("xyz", "abc"),
            new Cookie("Idam.Session", sessionCookieValue),
        };
        doReturn(cookies).when(request).getCookies();

        final String sessionToken = filter.getSessionToken(request);

        assertEquals(sessionCookieValue, sessionToken);
    }

    @Test
    public void dropCookie() {
        final String cookieName = "test";
        final RequestContext context = new RequestContext();
        filter.dropCookie(cookieName, context);
        final Map.Entry<String, String> cookie = context.getZuulRequestHeaders()
            .entrySet()
            .stream()
            .filter(h -> "cookie".equalsIgnoreCase(h.getKey()))
            .findFirst()
            .orElseThrow();

        assertEquals(cookieName + "=", cookie.getValue());
    }

    @Test
    public void run_shouldDelegateOnUnauthorized() throws JsonProcessingException {
        final String sessionToken = "sessionToken";
        doReturn(sessionToken).when(filter).getSessionToken(any());

        final RequestContext context = new RequestContext();
        final HttpServletRequest request = mock(HttpServletRequest.class);
        context.setRequest(request);
        RequestContext.testSetCurrentContext(context);

        final ApiAuthResult authResult = ApiAuthResult.builder().httpStatus(HttpStatus.UNAUTHORIZED).build();
        doReturn(authResult).when(spiService).authenticate(eq(sessionToken), any(), any());

        assertNull(filter.run());
        assertTrue(RequestContext.getCurrentContext().sendZuulResponse());
    }

    @Test
    public void run_shouldCallDropCookieIfMfaRequired() throws JsonProcessingException {
        final String sessionToken = "sessionToken";
        doReturn(sessionToken).when(filter).getSessionToken(any());

        final RequestContext context = new RequestContext();
        final HttpServletRequest request = mock(HttpServletRequest.class);
        context.setRequest(request);
        RequestContext.testSetCurrentContext(context);

        final ApiAuthResult authResult =
            ApiAuthResult.builder()
                .policiesAction(EvaluatePoliciesAction.MFA_REQUIRED)
                .build();
        doReturn(authResult).when(spiService).authenticate(eq(sessionToken), any(), any());

        assertNull(filter.run());
        assertTrue(RequestContext.getCurrentContext().sendZuulResponse());
        verify(filter, times(1)).dropCookie(any(), any());
    }

    @Test
    public void isPromptLogin_promptIsLogin() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        doReturn("login").when(request).getParameter("prompt");
        assertTrue(filter.isPromptLogin(request));
    }

    @Test
    public void isPromptLogin_promptIsNotLogin() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        doReturn("test-value").when(request).getParameter("prompt");
        assertFalse(filter.isPromptLogin(request));
    }

    @Test
    public void isPromptLogin_promptIsNotPresent() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        doReturn(null).when(request).getParameter("prompt");
        assertFalse(filter.isPromptLogin(request));
    }

}