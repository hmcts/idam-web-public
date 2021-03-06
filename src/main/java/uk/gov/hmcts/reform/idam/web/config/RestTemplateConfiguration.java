package uk.gov.hmcts.reform.idam.web.config;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContexts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.LocalePassingInterceptor;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

@Configuration
public class RestTemplateConfiguration {

    private final ConfigurationProperties configurationProperties;

    public RestTemplateConfiguration(ConfigurationProperties configurationProperties) {
        this.configurationProperties = configurationProperties;
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

}
