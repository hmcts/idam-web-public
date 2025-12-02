package uk.gov.hmcts.reform.idam.web.security;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Ensures the UI mode cookie is set on every response, including error responses.
 */
public class IdamUiCookieFilter implements Filter {

    public static final String COOKIE_NAME = "Idam.UI";
    public static final String COOKIE_VALUE = "classic";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Always set the cookie at the start of the filter so it is present even if downstream fails
        addUiModeCookie(httpResponse);

        chain.doFilter(httpRequest, httpResponse);
    }

    private void addUiModeCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(COOKIE_NAME, COOKIE_VALUE);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        // Session cookie by default (maxAge -1)
        cookie.setMaxAge(-1);
        response.addCookie(cookie);
    }

    @Override
    public void destroy() {
        // no-op
    }
}
