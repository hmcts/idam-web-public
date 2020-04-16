package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;

@Configuration
public class MessagesConfiguration implements WebMvcConfigurer {

    public static final String UI_LOCALES_PARAM_NAME = "ui_locales";
    public static final String IDAM_LOCALES_COOKIE_NAME = "idam_ui_locales";

    /** A 10 years worth of expiration time for the locale cookie. */
    private static final Integer COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10;

    @Autowired
    private ConfigurationProperties configurationProperties;

    @Bean
    public LocaleResolver localeResolver() {
        final CookieLocaleResolver localeResolver = new CookieLocaleResolver();
        localeResolver.setCookieName(IDAM_LOCALES_COOKIE_NAME);
        localeResolver.setCookieMaxAge(COOKIE_MAX_AGE_SECONDS);
        return localeResolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        final LocaleChangeInterceptor interceptor = new OIDCLocaleChangeInterceptor(configurationProperties.getStrategic().getLanguage().getSupportedLocales());
        interceptor.setParamName(UI_LOCALES_PARAM_NAME);
        interceptor.setIgnoreInvalidLocale(true);
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

}
