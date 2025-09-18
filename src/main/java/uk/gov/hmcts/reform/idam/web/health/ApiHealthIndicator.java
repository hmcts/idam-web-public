package uk.gov.hmcts.reform.idam.web.health;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;

import java.util.Optional;

import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.ERROR_TITLE;

@Component
public class ApiHealthIndicator implements HealthIndicator {

    private final SPIService spiService;

    @Autowired
    public ApiHealthIndicator(SPIService spiService) {
        this.spiService = spiService;
    }

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
            final ResponseEntity<HealthCheckStatus> response = spiService.healthCheck();
            final HttpStatus responseCode = response.getStatusCode();
            if (HttpStatus.OK.equals(responseCode)) {
                final String apiStatus = Optional.ofNullable(response.getBody()).orElseThrow().getStatus();
                if (apiStatus != null) {
                    if (Status.UP.getCode().equals(apiStatus)) {
                        return Health.up().build();
                    } else if (Status.DOWN.getCode().equals(apiStatus)) {
                        return Health.down()
                            .withDetail(ERROR_TITLE, "The API server status is DOWN")
                            .build();
                    }
                } else {
                    return Health.down()
                        .withDetail(ERROR_TITLE, "Couldn't determine the API server status")
                        .build();
                }
            }

            return Health.down()
                .withDetail("Http Status received", responseCode)
                .build();

        } catch (RestClientException e) {
            return Health.down()
                .withDetail(ERROR_TITLE, "An exception occurred while checking the API server status")
                .build();
        }
    }
}