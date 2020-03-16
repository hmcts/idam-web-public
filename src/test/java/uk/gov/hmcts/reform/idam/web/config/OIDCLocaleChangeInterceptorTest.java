package uk.gov.hmcts.reform.idam.web.config;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import uk.gov.hmcts.reform.idam.web.AppController;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebMvcTest(AppController.class)
@RunWith(SpringRunner.class)
public class OIDCLocaleChangeInterceptorTest {

    private static final String LOCALE_COOKIE_NAME = "org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE";
    private static final String EQUALS = "=";
    private static final String COOKIE_HEADER_NAME = "Set-Cookie";
    private static final String LANGUAGE_HEADER_NAME = "Content-Language";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LocaleChangeInterceptor localeChangeInterceptor;

    /**
     * @verifies accept no parameter
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldAcceptNoParameter() throws Exception {
        final String url = "/";
        final MvcResult result = this.mockMvc.perform(get(url)).andReturn();

        final List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);

        // should produce no cookie
        Assert.assertTrue(cookieHeaders.stream().noneMatch(h -> h.contains(LOCALE_COOKIE_NAME)));
    }

    /**
     * @verifies accept invalid locales when {@link org.springframework.web.servlet.i18n.LocaleChangeInterceptor#isIgnoreInvalidLocale()}
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldAcceptInvalidLocales() throws Exception {
        final String url = "/?ui_locales=null gibberish en";
        MvcResult result;

        result = this.mockMvc.perform(get(url)).andReturn();

        List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("en", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(LOCALE_COOKIE_NAME + EQUALS + "en")));
    }

    /**
     * @verifies set locale to first matching language tag
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldSetLocaleToFirstMatchingLanguageTag() throws Exception {
        final String url = "/?ui_locales=pl fr cy en";
        final MvcResult result = this.mockMvc.perform(get(url)).andReturn();

        final List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        final Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("cy", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(LOCALE_COOKIE_NAME + EQUALS + "cy")));
    }

    /**
     * @verifies set locale to a single tag
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldSetLocaleToASingleTag() throws Exception {
        final String url = "/?ui_locales=en";
        final MvcResult result = this.mockMvc.perform(get(url)).andReturn();

        final List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        final Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("en", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(LOCALE_COOKIE_NAME + EQUALS + "en")));
    }
}
