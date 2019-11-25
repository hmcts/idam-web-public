package uk.gov.hmcts.reform.idam.web.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

import java.util.regex.Pattern;

@ConfigurationProperties(prefix = "strategic")
@Data
public class StrategicConfigurationProperties {

    private ServiceConfigurationProperties service;
    private EndpointConfigurationProperties endpoint;
    private Policies policies;
    private Session session;

    @Data
    public static class ServiceConfigurationProperties {
        private String url;
        private String oidcprefix;
    }

    @Data
    public static class EndpointConfigurationProperties {

        private String authorize;
        private String loginWithPin;
        private String uplift;
        private String forgotPassword;
        private String resetPassword;
        private String validateResetPasswordToken;
        private String users;
        private String validateActivationToken;
        private String activation;
        private String userrole;
        private String search;
        private String authorizeOauth2;
        private String selfRegisterUser;
        private String selfRegistration;
        private String details;
        private String services;
        private String health;
        private String evaluatePolicies;
    }

    @Data
    public static class Policies {
        private String applicationName;
        private Pattern privateIpsFilterPattern;
    }

    @Data
    public static class Session {
        private String idamSessionCookie;
        private String affinityCookie;
    }
}
