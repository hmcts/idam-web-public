package uk.gov.hmcts.reform.idam.web.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;


@ConfigurationProperties(prefix = "server")
@Data
public class ServerConfigurationProperties {

    private int connectionTimeout;
    private int connectionRequestTimeout;
    private int readTimeout;
    private int maxConnectionIdleTime;
    private int maxConnectionsPerRoute;
    private int maxConnectionsTotal;
}
