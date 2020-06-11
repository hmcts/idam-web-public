package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.util.UriComponentsBuilder;
import uk.gov.hmcts.reform.idam.web.Application;
import uk.gov.hmcts.reform.idam.web.config.MessagesConfiguration;

import java.util.Locale;

@SpringBootTest
@RunWith(SpringRunner.class)
public class JSPHelperTest {

    private static final String BASE_TEST_URI = "http://example.com/";
    private static final String CORRECT_BASE_TEST_URI = "http://example.com/?ui_locales=";

    @Autowired
    ApplicationContext applicationContext;

    @Before
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
        Assert.assertEquals(CORRECT_BASE_TEST_URI + targetLocale, rewrittenUrl);
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
        Assert.assertEquals(CORRECT_BASE_TEST_URI + targetLocale, rewrittenUrl);
    }

    /**
     * @verifies throw on any of the parameters being null
     * @see JSPHelper#overrideLocaleParameter(org.springframework.web.util.UriComponentsBuilder, String)
     */
    @Test
    public void overrideLocaleParameter_shouldThrowOnAnyOfTheParametersBeingNull() {
        try {
            JSPHelper.overrideLocaleParameter(UriComponentsBuilder.newInstance(), null);
            Assert.fail();
        } catch (NullPointerException e) {
            // do nothing, expected
        }

        try {
            JSPHelper.overrideLocaleParameter(null, "en");
            Assert.fail();
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
        Assert.assertEquals("en", JSPHelper.getTargetLocale());
    }

    /**
     * @verifies return cy if current locale is english
     * @see JSPHelper#getTargetLocale()
     */
    @Test
    public void getTargetLocale_shouldReturnCyIfCurrentLocaleIsEnglish() {
        LocaleContextHolder.setLocale(new Locale("en"));
        Assert.assertEquals("cy", JSPHelper.getTargetLocale());
    }

    /**
     * @verifies return correct url for English
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test
    public void getOtherLocaleUrl_shouldReturnCorrectUrlForEnglish() throws Exception {
        LocaleContextHolder.setLocale(new Locale("en"));
        final String otherLocaleUrl = JSPHelper.getOtherLocaleUrl();
        Assert.assertTrue(otherLocaleUrl.endsWith("?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=cy"));
    }

    /**
     * @verifies return correct url for Welsh
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test
    public void getOtherLocaleUrl_shouldReturnCorrectUrlForWelsh() throws Exception {
        LocaleContextHolder.setLocale(new Locale("cy"));
        final String otherLocaleUrl = JSPHelper.getOtherLocaleUrl();
        Assert.assertTrue(otherLocaleUrl.endsWith("?" + MessagesConfiguration.UI_LOCALES_PARAM_NAME + "=en"));
    }

    /**
     * @verifies throw if there is no request in context
     * @see JSPHelper#getOtherLocaleUrl()
     */
    @Test(expected = IllegalStateException.class)
    public void getOtherLocaleUrl_shouldThrowIfThereIsNoRequestInContext() throws Exception {
        RequestContextHolder.resetRequestAttributes();
        JSPHelper.getOtherLocaleUrl();
    }
}
