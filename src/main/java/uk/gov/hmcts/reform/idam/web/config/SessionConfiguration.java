package uk.gov.hmcts.reform.idam.web.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
@EnableRedisHttpSession
@ConditionalOnProperty(name = "testing", havingValue = "false", matchIfMissing = true)
public class SessionConfiguration {

    private static final int FIVE_DAYS_IN_SECONDS = 432000;

    @Value("${authentication.secureCookie}")
    private Boolean useSecureCookie;

    @Value("${spring.redis.host}")
    private String redisHostName;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Value("${spring.redis.password}")
    private String redisPassword;

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("Idam.SSOSession");
        serializer.setCookiePath("/");
        // serializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$");
        serializer.setCookieMaxAge(FIVE_DAYS_IN_SECONDS);
        serializer.setUseSecureCookie(useSecureCookie);
        return serializer;
    }

    @Bean
    public LettuceConnectionFactory connectionFactory() {
        RedisStandaloneConfiguration serverConfig = new RedisStandaloneConfiguration(redisHostName, redisPort);
        if (StringUtils.isNotEmpty(redisPassword)) {
            serverConfig.setPassword(RedisPassword.of(redisPassword));
        }
        return new LettuceConnectionFactory(serverConfig);
    }

    /*
     * https://github.com/spring-projects/spring-session/issues/124
     */
    @Bean
    public static ConfigureRedisAction configureRedisAction() {
        return ConfigureRedisAction.NO_OP;
    }
}
