package uk.gov.hmcts.reform.idam.web.config.properties;

import lombok.Data;

import java.util.Map;

@Data
public class FeaturesConfigurationProperties {
    private FederatedSSO federatedSSO;

    @Data
    public static class FederatedSSO {
        private boolean enabled;
        private Map<String, String> ssoEmailDomains;
    }
}
