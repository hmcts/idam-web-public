package uk.gov.hmcts.reform.idam.web.config.properties;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@org.springframework.boot.context.properties.ConfigurationProperties
@Data
public class ConfigurationProperties {

    private ServerConfigurationProperties server;
    private StrategicConfigurationProperties strategic;
    private SSLConfigurationProperties ssl;
    private FeaturesConfigurationProperties features;
}
