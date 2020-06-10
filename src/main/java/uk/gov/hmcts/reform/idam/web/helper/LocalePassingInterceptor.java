package uk.gov.hmcts.reform.idam.web.helper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import javax.annotation.Nonnull;
import java.io.IOException;

@Slf4j
public class LocalePassingInterceptor implements ClientHttpRequestInterceptor {


    @Override
    public ClientHttpResponse intercept(@Nonnull HttpRequest request, @Nonnull byte[] body, ClientHttpRequestExecution execution) throws IOException {
        addMissingLanguageHeader(request);
        return execution.execute(request, body);
    }

    /**
     * @should add language header if absent
     * @should not modify existing language header
     */
    void addMissingLanguageHeader(@Nonnull HttpRequest request) {
        if (!request.getHeaders().containsKey(HttpHeaders.ACCEPT_LANGUAGE)) {
            request.getHeaders().add(HttpHeaders.ACCEPT_LANGUAGE, LocaleContextHolder.getLocale().toString());
        }
    }
}
