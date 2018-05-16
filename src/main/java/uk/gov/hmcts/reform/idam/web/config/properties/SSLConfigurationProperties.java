package uk.gov.hmcts.reform.idam.web.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "ssl")
public class SSLConfigurationProperties {

    private VerificationConfigurationProperties verification;

    @Data
    public static class VerificationConfigurationProperties {
        private Boolean enabled;
    }
}
