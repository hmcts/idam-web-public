package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.mock.http.client.MockClientHttpRequest;

import java.util.List;
import java.util.Locale;

public class LocalePassingInterceptorTest {

    /**
     * @verifies add language header if absent
     * @see LocalePassingInterceptor#addMissingLanguageHeader(org.springframework.http.HttpRequest)
     */
    @Test
    public void addMissingLanguageHeader_shouldAddLanguageHeaderIfAbsent() {
        final HttpRequest request = new MockClientHttpRequest();
        LocaleContextHolder.setLocale(new Locale("testLang"));
        final LocalePassingInterceptor interceptor = new LocalePassingInterceptor();
        interceptor.addMissingLanguageHeader(request);

        final List<String> acceptHeaders = request.getHeaders().get(HttpHeaders.ACCEPT_LANGUAGE);
        Assertions.assertNotNull(acceptHeaders);
        Assertions.assertEquals(1, acceptHeaders.size());
        Assertions.assertEquals(LocaleContextHolder.getLocale().toString(), acceptHeaders.get(0));
    }

    /**
     * @verifies that when the Accept-Language HTTP header is not already present, the interceptor should add it
     * with the value of the current locale
     * @see LocalePassingInterceptor#intercept(HttpRequest, byte[], ClientHttpRequestExecution)
     */
    @Test
    public void addMissingLanguageHeader_shouldNotModifyExistingLanguageHeader() throws Exception {
        final HttpRequest request = new MockClientHttpRequest();
        final String existingLanguageHeaderValue = "somethingDifferent";
        request.getHeaders().add(HttpHeaders.ACCEPT_LANGUAGE, existingLanguageHeaderValue);
        LocaleContextHolder.setLocale(new Locale("testLang"));
        final LocalePassingInterceptor interceptor = new LocalePassingInterceptor();
        interceptor.addMissingLanguageHeader(request);

        final List<String> acceptHeaders = request.getHeaders().get(HttpHeaders.ACCEPT_LANGUAGE);
        Assertions.assertNotNull(acceptHeaders);
        Assertions.assertEquals(1, acceptHeaders.size());
        Assertions.assertEquals(existingLanguageHeaderValue, acceptHeaders.get(0));
    }
}
