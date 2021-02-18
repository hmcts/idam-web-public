package uk.gov.hmcts.reform.idam.web.config.properties;

import lombok.Data;

@Data
public class FeaturesConfigurationProperties {
    private boolean federatedSSO;
    private boolean stepUpAuthentication;
    private boolean externalContactPage;
}
