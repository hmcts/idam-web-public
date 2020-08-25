package uk.gov.hmcts.reform.idam.web.config;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.client.RestTemplate;
import uk.gov.hmcts.reform.idam.web.client.OidcApi;
import uk.gov.hmcts.reform.idam.web.client.SsoFederationApi;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.AuthHelper;
import uk.gov.hmcts.reform.idam.web.helper.LocalePassingInterceptor;
import uk.gov.hmcts.reform.idam.web.sso.SSOAuthenticationSuccessHandler;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

@Configuration
public class AppConfiguration extends WebSecurityConfigurerAdapter {

    private final ConfigurationProperties configurationProperties;

    private final OAuth2AuthorizedClientRepository repository;

    private final SsoFederationApi ssoFederationApi;

    private final OidcApi oidcApi;

    private final AuthHelper authHelper;

    @Value("${spring.security.oauth2.client.provider.oidc.issuer-uri}")
    private String issuerUri;

    public AppConfiguration(ConfigurationProperties configurationProperties,
                            OAuth2AuthorizedClientRepository repository,
                            SsoFederationApi ssoFederationApi, OidcApi oidcApi, AuthHelper authHelper) {
        this.configurationProperties = configurationProperties;
        this.repository = repository;
        this.ssoFederationApi = ssoFederationApi;
        this.oidcApi = oidcApi;
        this.authHelper = authHelper;
    }

    @Bean
    public RestTemplate getRestTemplate()
        throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
        HttpClientBuilder httpClientBuilder = HttpClients.custom()
            .disableCookieManagement()
            .disableAuthCaching()
            .useSystemProperties()
            .evictIdleConnections(configurationProperties.getServer().getMaxConnectionIdleTime(), TimeUnit.SECONDS)
            .setMaxConnPerRoute(configurationProperties.getServer().getMaxConnectionsPerRoute())
            .setMaxConnTotal(configurationProperties.getServer().getMaxConnectionsTotal());

        if (!configurationProperties.getSsl().getVerification().getEnabled()) {
            TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
            SSLContext sslContext = SSLContexts.custom()
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();
            // ignore Sonar's weak hostname verifier as we are deliberately disabling SSL verification
            HostnameVerifier allowAllHostnameVerifier = (hostName, session) -> true; // NOSONAR

            SSLConnectionSocketFactory allowAllSslSocketFactory = new SSLConnectionSocketFactory(
                sslContext,
                allowAllHostnameVerifier);

            httpClientBuilder.setSSLSocketFactory(allowAllSslSocketFactory);
        }

        CloseableHttpClient client = httpClientBuilder.build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(client);
        requestFactory.setConnectionRequestTimeout(configurationProperties.getServer().getConnectionRequestTimeout());
        requestFactory.setConnectTimeout(configurationProperties.getServer().getConnectionTimeout());
        requestFactory.setReadTimeout(configurationProperties.getServer().getReadTimeout());

        final RestTemplate restTemplate = new RestTemplate(requestFactory);
        restTemplate.getInterceptors().add(new LocalePassingInterceptor());
        return restTemplate;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
                .ignoringAntMatchers("/o/**")
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
                    .failureUrl("/error?test=a")
                    .successHandler(myAuthenticationSuccessHandler(repository))
            .and()
                .oauth2ResourceServer()
            .jwt()
            .and()
            .and()
                .oauth2Client();
        // @formatter:on
    }

    @Bean
    public AuthenticationSuccessHandler myAuthenticationSuccessHandler(OAuth2AuthorizedClientRepository repository){
        return new SSOAuthenticationSuccessHandler(repository, ssoFederationApi, oidcApi,
            configurationProperties.getStrategic().getSession(), authHelper);
    }

     /*
      * If in future we have multiple providers this needs to be replaced with spring security 5s
      * JwtIssuerAuthenticationManagerResolver which supports multiple issuers
      */
    @Bean
    JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation(issuerUri);
        OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>();
        jwtDecoder.setJwtValidator(withAudience);

        return jwtDecoder;
    }
}