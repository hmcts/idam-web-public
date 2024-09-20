package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.hmcts.reform.idam.web.Application;
import uk.gov.hmcts.reform.idam.web.config.IdamWebMvcConfiguration;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@TestPropertySource(properties = "testing=true")
// Disable Redis autoconfigure for test
@TestPropertySource(properties = "SPRING_AUTOCONFIGURE_EXCLUDE=org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration")
@TestPropertySource(properties = "spring.session.store-type: none")
public class JSPHelperTest {

    private static final String BASE_TEST_URI = "http://example.com/";
    private static final String CORRECT_BASE_TEST_URI = "http://example.com/?ui_locales=";

    @Autowired
    ApplicationContext applicationContext;

    @BeforeEach
    public void setUp() {
        Application.setContext(applicationContext);
    }

    /**
     * @verifies override existing parameter
     * @see JSPHelper#overrideLocaleParameter(org.springframework.web.util.UriComponentsBuilder, String)
     */
    @Test
    public void overrideLocaleParameter_shouldOverrideExistingParameter() {
        final String targetLocale = "en";
        UriComponentsBuilder testBuilder = UriComponentsBuilder.fromUriString(BASE_TEST_URI);
        testBuilder.replaceQuery("ui_locales=pl");
        final String rewrittenUrl = JSPHelper.overrideLocaleParameter(testBuilder, targetLocale);
        Assertions.assertEquals(CORRECT_BASE_TEST_URI + targetLocale, rewrittenUrl);
    }

    /**
     * @verifies add nonexisting parameter
     * @see JSPHelper#overrideLocaleParameter(org.springframework.web.util.UriComponentsBuilder, String)
     */
    @Test
    public void overrideLocaleParameter_shouldAddNonexistingParameter() {
        final String targetLocale = "en";
        UriComponentsBuilder testBuilder = UriComponentsBuilder.fromUriString(BASE_TEST_URI);
        final String rewrittenUrl = JSPHelper.overrideLocaleParameter(testBuilder, targetLocale);
        Assertions.assertEquals(CORRECT_BASE_TEST_URI + targetLocale, rewrittenUrl);
    }

    /**
     * @verifies throw on any of the parameters being null
     * @see JSPHelper#overrideLocaleParameter(org.springframework.web.util.UriComponentsBuilder, String)
     */
    @Test
    public void overrideLocaleParameter_shouldThrowOnAnyOfTheParametersBeingNull() {
        try {
            JSPHelper.overrideLocaleParameter(UriComponentsBuilder.newInstance(), null);
            Assertions.fail();
        } catch (NullPointerException e) {
            // do nothing, expected
        }

        try {
            JSPHelper.overrideLocaleParameter(null, "en");
            Assertions.fail();
        } catch (NullPointerException e) {
            // do nothing, expected
        }
    }

    /**
     * @verifies return en if current locale is welsh
     * @see JSPHelper#getTargetLocale()
     */
    @Test
    public void getTargetLocale_shouldReturnEnIfCurrentLocaleIsWelsh() {
        LocaleContextHolder.setLocale(new Locale("cy"));
        Assertions.assertEquals("en", JSPHelper.getTargetLocale());
    }

    /**
     * @verifies return cy if current locale is english
     * @see JSPHelper#getTargetLocale()
     */
    @Test
    public void getTargetLocale_shouldReturnCyIfCurrentLocaleIsEnglish() {
        LocaleContextHolder.setLocale(new Locale("en"));
        Assertions.assertEquals("cy", JSPHelper.getTargetLocale());
    }

    /**
     * @verifies return correct url for English
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test
    public void getOtherLocaleUrl_shouldReturnCorrectUrlForEnglish() throws Exception {
        LocaleContextHolder.setLocale(new Locale("en"));
        final String otherLocaleUrl = JSPHelper.getOtherLocaleUrl();
        Assertions.assertTrue(otherLocaleUrl.endsWith("?" + IdamWebMvcConfiguration.UI_LOCALES_PARAM_NAME + "=cy"));
    }

    /**
     * @verifies return correct url for Welsh
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test
    public void getOtherLocaleUrl_shouldReturnCorrectUrlForWelsh() throws Exception {
        LocaleContextHolder.setLocale(new Locale("cy"));
        final String otherLocaleUrl = JSPHelper.getOtherLocaleUrl();
        Assertions.assertTrue(otherLocaleUrl.endsWith("?" + IdamWebMvcConfiguration.UI_LOCALES_PARAM_NAME + "=en"));
    }

    /**
     * @verifies throw if there is no request in context
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test
    public void getOtherLocaleUrl_shouldThrowIfThereIsNoRequestInContext() {
        RequestContextHolder.resetRequestAttributes();

        IllegalStateException expectedException =
            assertThrows(
                IllegalStateException.class,
                () -> JSPHelper.getOtherLocaleUrl());
    }

    @Test
    public void isGTMEnabled_shouldReturnTrueWhenEnabled() {
        JSPHelper.setGTMEnabled(true);
        Assertions.assertTrue(JSPHelper.isGTMEnabled());
    }

    @Test
    public void isGTMEnabled_shouldReturnFalseWhenNotEnabled() {
        JSPHelper.setGTMEnabled(false);
        Assertions.assertFalse(JSPHelper.isGTMEnabled());
    }

}
