package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.Set;

/**
 * Disallows certain HTTP methods from being usedin conjunction with Max-Forwards http header.
 * This is to prevent the "TRACE, OPTIONS methods with 'Max-Forwards' header. TRACK method." found by the ZapScanner.
 */
public class RequestMethodInterceptor extends HandlerInterceptorAdapter {

    static final Set<HttpMethod> FORBIDDEN_METHODS = Set.of(HttpMethod.OPTIONS, HttpMethod.TRACE);

    @Override
    public boolean preHandle(HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws IOException {

        final String requestMethod = request.getMethod();
        final boolean blockRequest = request.getHeader(HttpHeaders.MAX_FORWARDS) != null &&
            FORBIDDEN_METHODS.stream().anyMatch(forbiddenMethod -> forbiddenMethod.matches(requestMethod));

        if (blockRequest) {
            response.sendError(HttpStatus.METHOD_NOT_ALLOWED.value());
            return false;
        }
        return true;
    }
}
