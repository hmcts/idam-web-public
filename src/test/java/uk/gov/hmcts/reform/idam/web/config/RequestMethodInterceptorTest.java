package uk.gov.hmcts.reform.idam.web.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static  org.junit.jupiter.api.Assertions.assertFalse;
import static  org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

public class RequestMethodInterceptorTest {

    @Test
    public void preHandle_shouldRejectMethodWithHeader() {
        final RequestMethodInterceptor interceptor = new RequestMethodInterceptor();
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Object handler = new Object();

        RequestMethodInterceptor.FORBIDDEN_METHODS.forEach(forbiddenMethod -> {
            try {
                doReturn(forbiddenMethod.name()).when(request).getMethod();
                doReturn("1").when(request).getHeader(eq(HttpHeaders.MAX_FORWARDS));

                assertFalse(interceptor.preHandle(request, response, handler));
            } catch (IOException e) {
                Assertions.fail("Exception should not be thrown here");
            }
        });
    }

    @Test
    public void preHandle_shouldNotRejectMethodWithoutHeader() {
        final RequestMethodInterceptor interceptor = new RequestMethodInterceptor();
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Object handler = new Object();

        RequestMethodInterceptor.FORBIDDEN_METHODS.forEach(forbiddenMethod -> {
            try {
                doReturn(forbiddenMethod.name()).when(request).getMethod();
                doReturn(null).when(request).getHeader(eq(HttpHeaders.MAX_FORWARDS));

                assertTrue(interceptor.preHandle(request, response, handler));
            } catch (IOException e) {
                Assertions.fail("Exception should not be thrown here");
            }
        });
    }

    @Test
    public void preHandle_shouldNotRejectOtherHttpMethod() {
        final RequestMethodInterceptor interceptor = new RequestMethodInterceptor();
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        Object handler = new Object();

        try {
            doReturn(HttpMethod.GET.name()).when(request).getMethod();
            doReturn("1").when(request).getHeader(eq(HttpHeaders.MAX_FORWARDS));

            assertTrue(interceptor.preHandle(request, response, handler));
        } catch (IOException e) {
            Assertions.fail("Exception should not be thrown here");
        }

    }

}