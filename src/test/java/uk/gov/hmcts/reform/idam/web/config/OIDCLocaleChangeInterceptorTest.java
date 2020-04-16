package uk.gov.hmcts.reform.idam.web.config;

import com.google.common.collect.ImmutableSet;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.LocaleResolver;
import uk.gov.hmcts.reform.idam.web.AppController;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@WebMvcTest(AppController.class)
@RunWith(SpringRunner.class)
public class OIDCLocaleChangeInterceptorTest {

    private static final String EQUALS = "=";
    private static final String COOKIE_HEADER_NAME = "Set-Cookie";
    private static final String LANGUAGE_HEADER_NAME = "Content-Language";
    private static final Set<String> AVAILABLE_LOCALES = ImmutableSet.of("en", "cy");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private LocaleResolver localeResolver;

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
        Assert.assertTrue(cookieHeaders.stream().noneMatch(h -> h.contains(MessagesConfiguration.IDAM_LOCALES_COOKIE_NAME)));
    }

    /**
     * @verifies accept invalid locales when {@link org.springframework.web.servlet.i18n.LocaleChangeInterceptor#isIgnoreInvalidLocale()}
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldAcceptInvalidLocales() throws Exception {
        final String url = "/?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=null gibberish en";
        MvcResult result;

        result = this.mockMvc.perform(get(url)).andReturn();

        List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("en", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(MessagesConfiguration.IDAM_LOCALES_COOKIE_NAME + EQUALS + "en")));
    }

    /**
     * @verifies set locale to first matching language tag
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldSetLocaleToFirstMatchingLanguageTag() throws Exception {
        final String url = "/?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=pl fr cy en";
        final MvcResult result = this.mockMvc.perform(get(url)).andReturn();

        final List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        final Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("cy", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(MessagesConfiguration.IDAM_LOCALES_COOKIE_NAME + EQUALS + "cy")));
    }

    /**
     * @verifies set locale to a single tag
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldSetLocaleToASingleTag() throws Exception {
        final String url = "/?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=en";
        final MvcResult result = this.mockMvc.perform(get(url)).andReturn();

        final List<String> cookieHeaders = result.getResponse().getHeaders(COOKIE_HEADER_NAME);
        final Object languageHeader = result.getResponse().getHeaderValue(LANGUAGE_HEADER_NAME);

        Assert.assertEquals("en", languageHeader);
        Assert.assertTrue(cookieHeaders.stream().anyMatch(h -> h.contains(MessagesConfiguration.IDAM_LOCALES_COOKIE_NAME + EQUALS + "en")));
    }

    /**
     * @verifies throw if ignore invalid locale is true
     * @see OIDCLocaleChangeInterceptor#handleException(String, IllegalArgumentException)
     */
    @Test(expected = IllegalArgumentException.class)
    public void handleException_shouldThrowIfIgnoreInvalidLocaleIsTrue() {
        final OIDCLocaleChangeInterceptor interceptor = new OIDCLocaleChangeInterceptor(AVAILABLE_LOCALES);
        interceptor.setIgnoreInvalidLocale(false);
        interceptor.handleException(null, new IllegalArgumentException());
    }

    /**
     * @verifies not throw if ignore invalid locale is false
     * @see OIDCLocaleChangeInterceptor#handleException(String, IllegalArgumentException)
     */
    @Test
    public void handleException_shouldNotThrowIfIgnoreInvalidLocaleIsFalse() {
        final OIDCLocaleChangeInterceptor interceptor = new OIDCLocaleChangeInterceptor(AVAILABLE_LOCALES);
        interceptor.setIgnoreInvalidLocale(true);
        interceptor.handleException(null, new IllegalArgumentException());
    }

    /**
     * @verifies handle invalid locales tag exception
     * @see OIDCLocaleChangeInterceptor#preHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, Object)
     */
    @Test
    public void preHandle_shouldHandleInvalidLocalesTagException() {
        final OIDCLocaleChangeInterceptor interceptor = spy(new OIDCLocaleChangeInterceptor(AVAILABLE_LOCALES));
        interceptor.setParamName(MessagesConfiguration.UI_LOCALES_PARAM_NAME);
        interceptor.setIgnoreInvalidLocale(true);

        final String urlWithInvalidLanguageTag = "http://example.com/?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=^$*";
        final MockHttpServletRequest request =
            MockMvcRequestBuilders.request(HttpMethod.GET, urlWithInvalidLanguageTag).buildRequest(new MockServletContext());
        request.setAttribute(DispatcherServlet.LOCALE_RESOLVER_ATTRIBUTE, localeResolver);

        interceptor.preHandle(request, null, null);

        verify(interceptor).handleException(anyString(), any(IllegalArgumentException.class));
    }
}
