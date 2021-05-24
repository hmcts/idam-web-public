package uk.gov.hmcts.reform.idam.web.config.properties;

import lombok.Data;

@Data
public class FeaturesConfigurationProperties {
    private boolean federatedSSO;
    private boolean stepUpAuthentication;
    private ExternalContactPageProperties externalContactPage;
    private ExternalCookiePageProperties externalCookiePage;

    @Data
    public static class ExternalContactPageProperties {
        private Boolean enabled;
        private String url;

        public Boolean isEnabled() {
            return enabled;
        }
    }

    @Data
    public static class ExternalCookiePageProperties {
        private Boolean enabled;
        private String url;

        public Boolean isEnabled() {
            return enabled;
        }
    }
}


