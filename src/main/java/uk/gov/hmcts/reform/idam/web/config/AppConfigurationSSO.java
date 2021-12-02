package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.RequestMatcher;
import uk.gov.hmcts.reform.idam.web.client.OidcApi;
import uk.gov.hmcts.reform.idam.web.client.SsoFederationApi;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.AuthHelper;
import uk.gov.hmcts.reform.idam.web.sso.SSOAuthenticationSuccessHandler;

@Configuration
@ConditionalOnProperty("features.federated-s-s-o")
public class AppConfigurationSSO extends WebSecurityConfigurerAdapter {

    private final ConfigurationProperties configurationProperties;

    private final OAuth2AuthorizedClientRepository repository;

    private final SsoFederationApi ssoFederationApi;

    private final OidcApi oidcApi;

    private final AuthHelper authHelper;

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    @Value("${features.dynatrace.monitor.endpoint}")
    private String dynatraceMonitorEndpoint;

    public AppConfigurationSSO(ConfigurationProperties configurationProperties,
                               OAuth2AuthorizedClientRepository repository,
                               SsoFederationApi ssoFederationApi, OidcApi oidcApi,
                               AuthHelper authHelper) {
        this.configurationProperties = configurationProperties;
        this.repository = repository;
        this.ssoFederationApi = ssoFederationApi;
        this.oidcApi = oidcApi;
        this.authHelper = authHelper;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
            .ignoringAntMatchers("/o/**")
            .ignoringAntMatchers(dynatraceMonitorEndpoint)
            .csrfTokenRepository(new CookieCsrfTokenRepository()).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
            .antMatchers("/o/**").permitAll()
            .antMatchers("/resources/**").permitAll()
            .antMatchers("/assets/**").permitAll()
            .antMatchers("/users/register").permitAll()
            .antMatchers("/users/activate").permitAll()
            .anyRequest().permitAll()
            .and()
            .oauth2Login()
            // non existent page otherwise defaults to /login
            .loginPage("/sso/login.html")
            .failureUrl("/error")
            .successHandler(myAuthenticationSuccessHandler(repository))
            .and()
            .oauth2Client();
        // @formatter:on
    }

    @Bean
    public AuthenticationSuccessHandler myAuthenticationSuccessHandler(OAuth2AuthorizedClientRepository repository){
        return new SSOAuthenticationSuccessHandler(repository, ssoFederationApi, oidcApi,
            configurationProperties.getStrategic().getSession(), authHelper);
    }

}