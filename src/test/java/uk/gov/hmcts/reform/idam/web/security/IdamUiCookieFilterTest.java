package uk.gov.hmcts.reform.idam.web.security;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@RunWith(SpringRunner.class)
public class IdamUiCookieFilterTest {

    @Mock
    private HttpServletRequest httpRequest;

    @Mock
    private HttpServletResponse httpResponse;

    @Mock
    private FilterChain filterChain;

    private IdamUiCookieFilter filter;

    @Before
    public void setUp() {
        filter = new IdamUiCookieFilter();
    }

    @Test
    public void doFilter_shouldAddUiModeCookieAndContinueChain() throws ServletException, IOException {
        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);

        filter.doFilter(httpRequest, httpResponse, filterChain);

        verify(httpResponse).addCookie(cookieCaptor.capture());
        Cookie cookie = cookieCaptor.getValue();

        assertNotNull(cookie, "Cookie should not be null");
        assertEquals(IdamUiCookieFilter.COOKIE_NAME, cookie.getName());
        assertEquals(IdamUiCookieFilter.COOKIE_VALUE, cookie.getValue());
        assertEquals("/", cookie.getPath());
        assertTrue(cookie.getSecure(), "Cookie should be Secure");
        assertTrue(cookie.isHttpOnly(), "Cookie should be HttpOnly");
        assertEquals(-1, cookie.getMaxAge(), "Cookie should be a session cookie");

        verify(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));
    }

    @Test
    public void doFilter_shouldStillAddCookieWhenDownstreamThrows() throws Exception {
        ArgumentCaptor<Cookie> cookieCaptor = ArgumentCaptor.forClass(Cookie.class);

        try {
            Mockito.doThrow(new RuntimeException("Downstream failure"))
                .when(filterChain).doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class));

            assertThrows(RuntimeException.class, () -> filter.doFilter(httpRequest, httpResponse, filterChain));
        } finally {
            verify(httpResponse).addCookie(cookieCaptor.capture());
            Cookie cookie = cookieCaptor.getValue();
            assertEquals(IdamUiCookieFilter.COOKIE_NAME, cookie.getName());
            assertEquals(IdamUiCookieFilter.COOKIE_VALUE, cookie.getValue());
        }
    }
}
