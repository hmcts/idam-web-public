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

    public static final int ERROR_CODE_OK = 0;

    public static final int ERROR_CODE_DOWN = 1;

    public static final int ERROR_CODE_EXCEPTION = 2;

    /**
     * @should Return UP if response is 200 and contains status value of UP
     * @should Return DOWN if response is 200 but contains status value of DOWN
     * @should Return DOWN if response is not 200
     * @should Return DOWN if exception thrown
     *
     */
    @Override
    public Health health() {
        int errorCode = checkApiStatus();
        if (errorCode != ERROR_CODE_OK) {
            return Health.down().withDetail("Error Code", errorCode).build();
        }
        return Health.up().build();
    }

    private int checkApiStatus() {
        try {
            final ResponseEntity<String> response = spiService.healthCheck();
            final HttpStatus responseCode = response.getStatusCode();
            if (HttpStatus.OK.equals(responseCode)) {
                final ObjectNode responseJson = mapper.readValue(response.getBody(), ObjectNode.class);
                final JsonNode apiStatus = responseJson.get("status");
                if (Status.UP.getCode().equals(apiStatus.asText())) {
                    return ERROR_CODE_OK;
                }
            }
            return ERROR_CODE_DOWN;

        } catch (RestClientException | IOException e) {
            return ERROR_CODE_EXCEPTION;
        }
    }

}