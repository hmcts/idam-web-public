package uk.gov.hmcts.reform.idam.web.config.properties;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@org.springframework.boot.context.properties.ConfigurationProperties
@Data
public class ConfigurationProperties {

    private ServerConfigurationProperties server;
    private StrategicConfigurationProperties strategic;
    private SSLConfigurationProperties ssl;

}
