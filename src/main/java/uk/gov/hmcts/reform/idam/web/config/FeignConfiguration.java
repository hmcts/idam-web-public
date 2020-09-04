package uk.gov.hmcts.reform.idam.web.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import feign.Client;
import feign.Feign;
import feign.Request;
import feign.codec.Encoder;
import feign.codec.ErrorDecoder;
import feign.form.FormEncoder;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Dispatcher;
import okhttp3.OkHttpClient;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import uk.gov.hmcts.reform.idam.web.client.OidcApi;
import uk.gov.hmcts.reform.idam.web.client.SsoFederationApi;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import static uk.gov.hmcts.reform.idam.web.helper.ErrorHelper.restException;

/*
 * Most of this class is required to stop feign from following redirects and to allow for
 * both Header and ParamMap parameters in the same request
 */
@Configuration
@Slf4j
public class FeignConfiguration {

    private final Client httpClient;

    private final ErrorDecoder errorDecoder;

    private final Encoder feignFormEncoder;

    private final Request.Options options;

    public FeignConfiguration() {
        this.httpClient = client();
        this.errorDecoder = errorDecoder();
        this.feignFormEncoder = feignFormEncoder();
        this.options = new Request.Options(10, TimeUnit.SECONDS, 60,
            TimeUnit.SECONDS, false);
    }

    @Bean
    public OidcApi oidcApi(@Value("${strategic.service.url}") String target) {
        return buildFeignClient(OidcApi.class, target);
    }

    @Bean
    public SsoFederationApi ssoFederationApi(@Value("${strategic.service.url}") String target) {
        return buildFeignClient(SsoFederationApi.class, target);
    }

    private <T> T buildFeignClient(Class<T> clazz, String target) {
        return Feign.builder()
            .client(httpClient)
            .options(options)
            .encoder(feignFormEncoder)
            .decoder(new JacksonDecoder())
            .errorDecoder(errorDecoder)
            .logger(new Slf4jLogger(clazz))
            .target(clazz, target);
    }

    public Client client() {
        Dispatcher dispatcher = new Dispatcher();
        dispatcher.setMaxRequests(200);
        dispatcher.setMaxRequestsPerHost(200);
        OkHttpClient httpClient = new OkHttpClient.Builder()
            .dispatcher(dispatcher)
            .readTimeout(20000, TimeUnit.MILLISECONDS)
            .followRedirects(false)
            .followSslRedirects(false)
            .build();
        return new feign.okhttp.OkHttpClient(httpClient);
    }

    public Encoder feignFormEncoder() {
        return new FormEncoder(new JacksonEncoder(createObjectMapper()));
    }

    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            final HttpStatus errorCode = HttpStatus.valueOf(response.status());
            final MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
            byte[] bodyBytes = new byte[0];
            if (response.body() != null) {
                try (Reader bodyReader = response.body().asReader(StandardCharsets.UTF_8)) {
                    bodyBytes = IOUtils.toByteArray(bodyReader, StandardCharsets.UTF_8);
                } catch (IOException e) {
                    log.error(e.getMessage(), e);
                }
            }
            HttpStatusCodeException exception = restException(null, errorCode, new HttpHeaders(headers), bodyBytes);
            log.error(methodKey.toUpperCase(), exception);
            return exception;
        };
    }

    private ObjectMapper createObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
        objectMapper.enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING);
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.disable(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
