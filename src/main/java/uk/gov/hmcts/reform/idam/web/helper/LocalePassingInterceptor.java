package uk.gov.hmcts.reform.idam.web.helper;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import javax.annotation.Nonnull;
import java.io.IOException;

/**
 * Intercepts an HTTP request and adds {@code Accept-Language} header matching current user's locale.
 */
public class LocalePassingInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(@Nonnull HttpRequest request, @Nonnull byte[] body, ClientHttpRequestExecution execution) throws IOException {
        request.getHeaders().add(HttpHeaders.ACCEPT_LANGUAGE, LocaleContextHolder.getLocale().toString());
        return execution.execute(request, body);
    }
}
