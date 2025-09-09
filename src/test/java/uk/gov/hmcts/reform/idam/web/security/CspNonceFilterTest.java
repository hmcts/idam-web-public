package uk.gov.hmcts.reform.idam.web.security;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
public class CspNonceFilterTest {

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @Mock
    private FilterChain filterChain;

    @Mock
    private FilterConfig filterConfig;

    private CspNonceFilter cspNonceFilter;

    @Before
    public void setUp() {
        cspNonceFilter = new CspNonceFilter();
    }

    @Test
    public void init_shouldNotThrowException() {
        assertDoesNotThrow(() -> cspNonceFilter.init(filterConfig));
    }

    @Test
    public void destroy_shouldNotThrowException() {
        assertDoesNotThrow(() -> cspNonceFilter.destroy());
    }

    @Test
    public void doFilter_shouldGenerateNonceAndSetRequestAttribute() throws ServletException, IOException {
        ArgumentCaptor<String> nonceCaptor = ArgumentCaptor.forClass(String.class);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);

        verify(httpRequest).setAttribute(eq("cspNonce"), nonceCaptor.capture());
        String capturedNonce = nonceCaptor.getValue();

        assertNotNull(capturedNonce, "Nonce should not be null");
        assertFalse(capturedNonce.isEmpty(), "Nonce should not be empty");
    }

    @Test
    public void doFilter_shouldSetContentSecurityPolicyHeader() throws ServletException, IOException {
        ArgumentCaptor<String> cspHeaderCaptor = ArgumentCaptor.forClass(String.class);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);

        verify(httpResponse).setHeader(eq("Content-Security-Policy"), cspHeaderCaptor.capture());
        String cspHeader = cspHeaderCaptor.getValue();

        assertNotNull(cspHeader, "CSP header should not be null");
        assertTrue(cspHeader.contains("default-src 'self'"), "CSP should contain default-src directive");
        assertTrue(cspHeader.contains("script-src 'self' 'nonce-"), "CSP should contain script-src with nonce");
        assertTrue(cspHeader.contains("style-src 'self' 'unsafe-inline'"), "CSP should contain style-src directive");
        assertTrue(cspHeader.contains("frame-ancestors 'none'"), "CSP should contain frame-ancestors directive");
    }

    @Test
    public void doFilter_shouldIncludeNonceInCspHeader() throws ServletException, IOException {
        ArgumentCaptor<String> nonceCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> cspHeaderCaptor = ArgumentCaptor.forClass(String.class);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);

        verify(httpRequest).setAttribute(eq("cspNonce"), nonceCaptor.capture());
        verify(httpResponse).setHeader(eq("Content-Security-Policy"), cspHeaderCaptor.capture());

        String nonce = nonceCaptor.getValue();
        String cspHeader = cspHeaderCaptor.getValue();

        assertTrue(cspHeader.contains("'nonce-" + nonce + "'"),
            "CSP header should contain the generated nonce");
    }


    @Test
    public void doFilter_shouldContinueFilterChain() throws ServletException, IOException {
        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);
        verify(filterChain).doFilter(httpRequest, httpResponse);
    }

    @Test
    public void doFilter_shouldGenerateUniqueNoncesForMultipleRequests() throws ServletException, IOException {
        ArgumentCaptor<String> nonce1Captor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> nonce2Captor = ArgumentCaptor.forClass(String.class);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);
        verify(httpRequest).setAttribute(eq("cspNonce"), nonce1Captor.capture());

        reset(httpRequest, httpResponse, filterChain);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);
        verify(httpRequest).setAttribute(eq("cspNonce"), nonce2Captor.capture());

        String nonce1 = nonce1Captor.getValue();
        String nonce2 = nonce2Captor.getValue();

        assertNotEquals(nonce1, nonce2, "Each request should get a unique nonce");
    }

    @Test
    public void doFilter_shouldSetAttributeBeforeSettingHeader() throws ServletException, IOException {
        ArgumentCaptor<String> nonceCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> cspCaptor = ArgumentCaptor.forClass(String.class);

        cspNonceFilter.doFilter(httpRequest, httpResponse, filterChain);

        verify(httpRequest).setAttribute(eq("cspNonce"), nonceCaptor.capture());
        verify(httpResponse).setHeader(eq("Content-Security-Policy"), cspCaptor.capture());

        String nonce = nonceCaptor.getValue();
        String cspHeader = cspCaptor.getValue();

        assertTrue(cspHeader.contains("'nonce-" + nonce + "'"),
            "The nonce in CSP header should match the one set as request attribute");
    }
}
