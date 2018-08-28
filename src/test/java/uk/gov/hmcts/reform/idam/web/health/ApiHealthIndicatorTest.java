package uk.gov.hmcts.reform.idam.web.health;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.actuate.health.Health;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class ApiHealthIndicatorTest {

    @Mock
    private SPIService spiService;

    @Mock
    private ObjectMapper mapper;

    @InjectMocks
    private ApiHealthIndicator apiHealthIndicator;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ConfigurationProperties configurationProperties;

    final ResponseEntity<String> upResponse = ResponseEntity.ok("{\"status\": \"UP\"}");
    final ResponseEntity<String> downResponse = ResponseEntity.ok("{\"status\": \"DOWN\"}");

    @Before
    public void setUp() throws Exception {
        final ObjectMapper objMapper = new ObjectMapper();
        final ObjectNode upResponseJson = objMapper.readValue(upResponse.getBody(), ObjectNode.class);
        final ObjectNode downResponseJson = objMapper.readValue(downResponse.getBody(), ObjectNode.class);

        given(mapper.readValue(upResponse.getBody(), ObjectNode.class)).willReturn(upResponseJson);
        given(mapper.readValue(downResponse.getBody(), ObjectNode.class)).willReturn(downResponseJson);
    }

    /**
     * @verifies Return UP if response is 200 and contains status value of UP
     * @see ApiHealthIndicator#health()
     */
    @Test
    public void health_shouldReturnUPIfResponseIs200AndContainsStatusValueOfUP() throws Exception {
        given(spiService.healthCheck()).willReturn(upResponse);
        Health health = apiHealthIndicator.health();

        assertThat(health.getStatus().toString(), equalTo("UP"));
        assertThat(health, equalTo(Health.up().build()));
    }

    /**
     * @verifies Return DOWN if response is 200 but contains status value of DOWN
     * @see ApiHealthIndicator#health()
     */
    @Test
    public void health_shouldReturnDOWNIfResponseIs200ButContainsStatusValueOfDOWN() throws Exception {
        given(spiService.healthCheck()).willReturn(downResponse);
        Health health = apiHealthIndicator.health();

        assertThat(health.getStatus().toString(), equalTo("DOWN"));
        assertThat(health.getDetails().get("Error").toString(), equalTo("The API server status is DOWN"));
    }

    /**
     * @verifies Return DOWN if response is not 200
     * @see ApiHealthIndicator#health()
     */
    @Test
    public void health_shouldReturnDOWNIfResponseIsNot200() throws Exception {
        given(spiService.healthCheck()).willReturn(ResponseEntity.status(500).build());
        Health health = apiHealthIndicator.health();

        assertThat(health.getStatus().toString(), equalTo("DOWN"));
        assertThat(health.getDetails().get("Http Status received").toString(), equalTo(HttpStatus.INTERNAL_SERVER_ERROR.toString()));
    }

    /**
     * @verifies Return DOWN if exception thrown
     * @see ApiHealthIndicator#health()
     */
    @Test
    public void health_shouldReturnDOWNIfExceptionThrown() throws Exception {
        given(spiService.healthCheck()).willThrow(new RestClientException("SomeException"));
        Health health = apiHealthIndicator.health();

        assertThat(health.getStatus().toString(), equalTo("DOWN"));
        assertThat(health.getDetails().get("error").toString(), equalTo("org.springframework.web.client.RestClientException: SomeException"));
    }
}
