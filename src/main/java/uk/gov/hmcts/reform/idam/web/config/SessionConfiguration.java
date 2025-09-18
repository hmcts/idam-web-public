package uk.gov.hmcts.reform.idam.web.config;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.NettyCustomizer;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.socket.nio.NioChannelOption;
import jdk.net.ExtendedSocketOptions;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

import java.time.Duration;

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

    @Value("${spring.redis.custom.command.timeout}")
    private Duration redisCommandTimeout;

    @Value("${spring.redis.timeout}")
    private Duration socketTimeout;

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
        final SocketOptions socketOptions = SocketOptions.builder().connectTimeout(socketTimeout).build();

        final ClientResources resources = ClientResources.builder()
            .nettyCustomizer(new NettyCustomizer() {
                @Override
                public void afterBootstrapInitialized(Bootstrap bootstrap) {
                    bootstrap.option(NioChannelOption.of(ExtendedSocketOptions.TCP_KEEPIDLE), 15);
                    bootstrap.option(NioChannelOption.of(ExtendedSocketOptions.TCP_KEEPINTERVAL), 5);
                    bootstrap.option(NioChannelOption.of(ExtendedSocketOptions.TCP_KEEPCOUNT), 3);
                }
            })
            .build();

        final ClientOptions clientOptions = ClientOptions.builder()
            .socketOptions(socketOptions)
            .cancelCommandsOnReconnectFailure(true)
            .disconnectedBehavior(ClientOptions.DisconnectedBehavior.REJECT_COMMANDS)
            .build();

        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
            .commandTimeout(redisCommandTimeout)
            .clientOptions(clientOptions)
            .clientResources(resources)
            .useSsl()
            .build();
        RedisStandaloneConfiguration serverConfig = new RedisStandaloneConfiguration(redisHostName,
            redisPort);
        if (StringUtils.isNotEmpty(redisPassword)) {
            serverConfig.setPassword(RedisPassword.of(redisPassword));
        }

        final LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(serverConfig,
            clientConfig);
        return lettuceConnectionFactory;
    }

    @Bean
    public RedisTemplate<Object, Object> sessionRedisTemplate() {
        final RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory());
        return template;
    }

    /*
     * https://github.com/spring-projects/spring-session/issues/124
     */
    @Bean
    public static ConfigureRedisAction configureRedisAction() {
        return ConfigureRedisAction.NO_OP;
    }
}
