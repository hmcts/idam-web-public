package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import uk.gov.hmcts.reform.idam.web.Application;
import uk.gov.hmcts.reform.idam.web.config.MessagesConfiguration;

import java.util.Locale;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@SpringBootTest
@RunWith(SpringRunner.class)
@TestPropertySource(properties = "testing=true")
public class JSPHelperCyTest {

    @Mock
    ApplicationContext applicationContext;

    @Mock
    MessageSource cyMessageSource;

    @Before
    public void setUp() {
        given(cyMessageSource.getMessage(anyString(), any(), any())).willReturn("cy");
        given(applicationContext.getBean(MessageSource.class)).willReturn(cyMessageSource);
        Application.setContext(applicationContext);
    }

    /**
     * @verifies return cy if current locale is english
     * @see JSPHelper#getTargetLocale()
     */
    @Test
    public void getTargetLocale_shouldReturnCyIfCurrentLocaleIsEnglish() throws InterruptedException {
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
}
