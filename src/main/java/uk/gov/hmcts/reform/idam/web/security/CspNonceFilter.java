package uk.gov.hmcts.reform.idam.web.security;

import org.springframework.http.HttpHeaders;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CspNonceFilter implements Filter {

    private static final String CSP_NONCE_ATTRIBUTE = "cspNonce";

    private final CspNonceService cspNonceService;

    public CspNonceFilter() {
        this.cspNonceService = new CspNonceService();
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization needed
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Generate nonce for this request
        String nonce = cspNonceService.generateNonce();

        // Make nonce available to JSP pages in multiple ways
        httpRequest.setAttribute(CSP_NONCE_ATTRIBUTE, nonce);

        // Update CSP header with the generated nonce
        String cspPolicy = "default-src 'self'; " +
                          "script-src 'self' 'nonce-" + nonce + "' https://www.googletagmanager.com; " +
                          "style-src 'self' 'nonce-" + nonce + "'; " +
                          "img-src 'self' data: https://www.googletagmanager.com; " +
                          "font-src 'self' data:; " +
                          "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; " +
                          "form-action https: http:; " +
                          "base-uri 'self'; " +
                          "frame-src https://www.googletagmanager.com; " +
                          "frame-ancestors 'none';";

        httpResponse.setHeader("Content-Security-Policy", cspPolicy);

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // No cleanup needed
    }
}
