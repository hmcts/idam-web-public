package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.Assert;
import org.junit.Test;
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
        Assert.assertNotNull(acceptHeaders);
        Assert.assertEquals(1, acceptHeaders.size());
        Assert.assertEquals(LocaleContextHolder.getLocale().toString(), acceptHeaders.get(0));
    }

    /**
     * @verifies not modify existing language header
     * @see LocalePassingInterceptor#addMissingLanguageHeader(HttpRequest)
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
        Assert.assertNotNull(acceptHeaders);
        Assert.assertEquals(1, acceptHeaders.size());
        Assert.assertEquals(existingLanguageHeaderValue, acceptHeaders.get(0));
    }
}
