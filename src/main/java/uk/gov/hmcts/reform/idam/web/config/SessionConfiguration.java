package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
@EnableRedisHttpSession
@ConditionalOnProperty(name = "testing", havingValue = "false", matchIfMissing = true)
public class SessionConfiguration {

    @Value("${authentication.secureCookie}")
    private Boolean useSecureCookie;

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("Idam.SSOSession");
        serializer.setCookiePath("/");
        serializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$");
        serializer.setCookieMaxAge(432000);
        serializer.setUseSecureCookie(useSecureCookie);
        return serializer;
    }

    /*
     * https://github.com/spring-projects/spring-session/issues/124
     */
    @Bean
    public static ConfigureRedisAction configureRedisAction() {
        return ConfigureRedisAction.NO_OP;
    }
}
