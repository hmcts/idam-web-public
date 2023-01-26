package uk.gov.hmcts.reform.idam.web.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.web.firewall.HttpStatusRequestRejectedHandler;
import org.springframework.security.web.firewall.RequestRejectedException;
import org.springframework.security.web.firewall.RequestRejectedHandler;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.mvc.WebContentInterceptor;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.JSPHelper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Configuration
public class IdamWebMvcConfiguration implements WebMvcConfigurer {

    public static final String UI_LOCALES_PARAM_NAME = "ui_locales";
    public static final String IDAM_LOCALES_COOKIE_NAME = "idam_ui_locales";
    @Value("${features.google-tag-manager:true}")
    public void setGoogleTagManagerFeatureFlag(boolean value) {
        JSPHelper.setGTMEnabled(value);
    }

    /** A 10 years worth of expiration time for the locale cookie. */
    private static final Integer COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10;

    @Autowired
    private ConfigurationProperties configurationProperties;

    @Bean
    public TomcatContextCustomizer sameSiteCookiesConfig() {
        return context -> {
            final Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
            cookieProcessor.setSameSiteCookies(SameSiteCookies.STRICT.getValue());
            context.setCookieProcessor(cookieProcessor);
        };
    }

    @Bean
    public LocaleResolver localeResolver() {
        final CookieLocaleResolver localeResolver = new CookieLocaleResolver();
        localeResolver.setCookieName(IDAM_LOCALES_COOKIE_NAME);
        localeResolver.setCookieMaxAge(COOKIE_MAX_AGE_SECONDS);
        localeResolver.setCookieSecure(true);
        localeResolver.setCookieHttpOnly(true);
        return localeResolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        final LocaleChangeInterceptor interceptor = new OIDCLocaleChangeInterceptor(configurationProperties.getStrategic().getLanguage().getSupportedLocales());
        interceptor.setParamName(UI_LOCALES_PARAM_NAME);
        interceptor.setIgnoreInvalidLocale(true);
        return interceptor;
    }

    @Bean
    WebContentInterceptor initWebContentInterceptor() {
        WebContentInterceptor webContentInterceptor = new WebContentInterceptor();
        webContentInterceptor.setCacheControl(CacheControl.noStore().mustRevalidate());
        return webContentInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
        registry.addInterceptor(initWebContentInterceptor());
        registry.addInterceptor(requestMethodInterceptor());
    }

    @Bean
    public RequestMethodInterceptor requestMethodInterceptor() {
        return new RequestMethodInterceptor();
    }

    @Bean
    public RequestRejectedHandler requestRejectedHandler() {
        return new HttpStatusRequestRejectedHandler(HttpStatus.BAD_REQUEST.value()) {
            @Override
            public void handle(HttpServletRequest request, HttpServletResponse response, RequestRejectedException requestRejectedException) throws IOException {
                log.error("Request rejected due to Spring Security", requestRejectedException);
                response.sendError(HttpStatus.BAD_REQUEST.value());
            }
        };
    }
    /**
     * return HTML by default when not sure.
     */
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.TEXT_HTML, MediaType.APPLICATION_XHTML_XML,
            MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON);
    }
}
