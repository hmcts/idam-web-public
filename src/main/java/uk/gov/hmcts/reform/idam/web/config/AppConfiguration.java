package uk.gov.hmcts.reform.idam.web.config;

import java.util.concurrent.TimeUnit;

import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.client.RestTemplate;

import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

@Configuration
public class AppConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private ConfigurationProperties configurationProperties;

    @Bean
    public RestTemplate getRestTemplate() {
        CloseableHttpClient client = HttpClients.custom()
            .disableCookieManagement()
            .disableAuthCaching()
            .useSystemProperties()
            .evictIdleConnections(configurationProperties.getServer().getMaxConnectionIdleTime(), TimeUnit.SECONDS)
            .setMaxConnPerRoute(configurationProperties.getServer().getMaxConnectionsPerRoute())
            .setMaxConnTotal(configurationProperties.getServer().getMaxConnectionsTotal())
            .build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(client);
        requestFactory.setConnectionRequestTimeout(configurationProperties.getServer().getConnectionRequestTimeout());
        requestFactory.setConnectTimeout(configurationProperties.getServer().getConnectionTimeout());
        requestFactory.setReadTimeout(configurationProperties.getServer().getReadTimeout());

        return new RestTemplate(requestFactory);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/resources/**").permitAll()
            .antMatchers("/assets/**").permitAll()
            .antMatchers("/users/register").permitAll()
            .antMatchers("/users/activate").permitAll()
            .anyRequest()
            .permitAll();
    }
}