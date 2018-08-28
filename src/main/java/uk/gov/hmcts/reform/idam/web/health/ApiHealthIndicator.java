package uk.gov.hmcts.reform.idam.web.health;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;

import java.io.IOException;

@Component
public class ApiHealthIndicator implements HealthIndicator {

    @Autowired
    private SPIService spiService;

    @Autowired
    private ObjectMapper mapper;

    /**
     * @should Return UP if response is 200 and contains status value of UP
     * @should Return DOWN if response is 200 but contains status value of DOWN
     * @should Return DOWN if response is not 200
     * @should Return DOWN if exception thrown
     * @should Return DOWN if can't determine API server status
     *
     */
    @Override
    public Health health() {
        return checkApiStatus();
    }

    private Health checkApiStatus() {
        try {
            final ResponseEntity<String> response = spiService.healthCheck();
            final HttpStatus responseCode = response.getStatusCode();
            if (HttpStatus.OK.equals(responseCode)) {
                final ObjectNode responseJson = mapper.readValue(response.getBody(), ObjectNode.class);
                final JsonNode apiStatus = responseJson.get("status");
                if (apiStatus != null) {
                    if (Status.UP.getCode().equals(apiStatus.asText())) {
                        return Health.up().build();
                    } else if (Status.DOWN.getCode().equals(apiStatus.asText())) {
                        return Health.down()
                            .withDetail("Error", "The API server status is DOWN")
                            .build();
                    }
                } else {
                    return Health.down()
                        .withDetail("Error", "Couldn't determine the API server status")
                        .build();
                }
            }

            return Health.down()
                .withDetail("Http Status received", responseCode)
                .build();

        } catch (RestClientException | IOException e) {
            return Health.down(e).build();
        }
    }
}