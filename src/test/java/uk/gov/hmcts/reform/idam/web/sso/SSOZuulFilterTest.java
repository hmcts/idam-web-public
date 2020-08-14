package uk.gov.hmcts.reform.idam.web.sso;

import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import com.netflix.zuul.monitoring.CounterFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import java.io.IOException;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@RunWith(MockitoJUnitRunner.class)
public class SSOZuulFilterTest {

    private SSOZuulFilter underTest;

    @Mock
    private MockHttpServletRequest request;

    @Mock
    private MockHttpServletResponse response;

    @Mock
    private RequestContext mockContext;

    @Mock
    private HttpSession session;

    @Before
    public void setUp() {
        underTest = new SSOZuulFilter();
        when(mockContext.getRequest()).thenReturn(request);
        when(mockContext.getResponse()).thenReturn(response);
        when(request.getSession()).thenReturn(session);
        RequestContext.testSetCurrentContext(mockContext);
        CounterFactory.initialize(new CounterFactory() {
            @Override
            public void increment(String name) {

            }
        });
    }

    @Test
    public void filterType() {
        assertEquals(underTest.filterType(), PRE_TYPE);
    }

    @Test
    public void filterOrder() {
        assertEquals(underTest.filterOrder(), 0);
    }

    @Test
    public void shouldFilter() {
        given(request.getParameter("login_hint")).willReturn("ejudiciary-aad");
        assertTrue(underTest.shouldFilter());
    }

    @Test
    public void run() throws IOException, ZuulException {
        given(request.getParameter(eq("login_hint"))).willReturn("ejudiciary-aad");
        underTest.run();
        verify(response, atLeastOnce()).sendRedirect(anyString());
    }

    @Test(expected = ZuulException.class)
    public void run_shouldThrowZuulExceptionIfRedirectFails() throws IOException, ZuulException {
        given(request.getParameter("login_hint")).willReturn("ejudiciary-aad");
        doThrow(new IOException()).when(response).sendRedirect(anyString());
        underTest.run();
    }
}