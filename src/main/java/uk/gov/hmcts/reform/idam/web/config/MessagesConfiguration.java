package uk.gov.hmcts.reform.idam.web.config;

import com.google.common.collect.ImmutableSet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;

import java.util.Locale;
import java.util.Set;

@Configuration
public class MessagesConfiguration implements WebMvcConfigurer {

    public static final Set<Locale> SUPPORTED_LOCALES =
        ImmutableSet.of(Locale.forLanguageTag("en"), Locale.forLanguageTag("cy"));

    @Bean
    public LocaleResolver localeResolver() {
        return new CookieLocaleResolver();
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        final LocaleChangeInterceptor interceptor = new OIDCLocaleChangeInterceptor(SUPPORTED_LOCALES);
        interceptor.setParamName("ui_locales");
        interceptor.setIgnoreInvalidLocale(true);
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

}
