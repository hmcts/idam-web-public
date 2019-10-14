package uk.gov.hmcts.reform.idam.web.strategic;

import com.google.common.collect.ImmutableMap;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import uk.gov.hmcts.reform.idam.api.external.model.ActionMap;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesRequest;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesResponse;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesResponseInner;
import uk.gov.hmcts.reform.idam.api.external.model.Subject;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.http.ResponseEntity.ok;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.IDAM_SESSION_COOKIE_NAME;

@RunWith(MockitoJUnitRunner.class)
public class PolicyServiceTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    ConfigurationProperties configurationProperties;
    @Mock
    RestTemplate restTemplate;
    @InjectMocks
    PolicyService service;

    @Before
    public void setupProps() {
        given(configurationProperties.getStrategic().getPolicies().getApplicationName())
            .willReturn("applicationName");
        given(configurationProperties.getStrategic().getService().getUrl())
            .willReturn("idamApi");
        given(configurationProperties.getStrategic().getEndpoint().getEvaluatePolicies())
            .willReturn("evaluatePolicies");
    }

    EvaluatePoliciesResponse mockResponse(final ActionMap actionMap) {
        final EvaluatePoliciesResponse response = new EvaluatePoliciesResponse();
        response.add(new EvaluatePoliciesResponseInner()
            .actions(actionMap));
        return response;
    }

    EvaluatePoliciesRequest expectedRequest(String resource, String application, String ssoToken, String ipAddress) {
        return new EvaluatePoliciesRequest()
            .resources(singletonList("someUri"))
            .application("applicationName")
            .subject(new Subject().ssoToken("someToken"))
            .environment(ImmutableMap.of("requestIp", singletonList("someIpAddress")));
    }

    HttpHeaders expectedHeaders(String token, String ipAddress) {
        final HttpHeaders headers = new HttpHeaders();
        headers.put("X-Forwarded-For", singletonList(ipAddress));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.put(HttpHeaders.COOKIE, singletonList(String.format("%s=%s", IDAM_SESSION_COOKIE_NAME, token)));
        headers.setBearerAuth(token);
        return headers;
    }

    /**
     * @verifies return true when no actions are returned
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnTrueWhenNoActionsAreReturned() {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(new ActionMap())));

        boolean result = service.evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(Boolean.valueOf(result), is(Boolean.TRUE));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies return true when all actions return true
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnTrueWhenAllActionsReturnTrue() {
        final ActionMap actionMap = new ActionMap();
        actionMap.put("someKey", Boolean.TRUE);
        actionMap.put("anotherKey", Boolean.TRUE);
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(actionMap)));

        boolean result = service.evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(Boolean.valueOf(result), is(Boolean.TRUE));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies return false when any action returns false
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnFalseWhenAnyActionReturnsFalse() {
        final ActionMap actionMap = new ActionMap();
        actionMap.put("someKey", Boolean.TRUE);
        actionMap.put("anotherKey", Boolean.FALSE);
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(actionMap)));

        boolean result = service.evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(Boolean.valueOf(result), is(Boolean.FALSE));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies throw exception when response is not successful
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test(expected = HttpClientErrorException.class)
    public void evaluatePoliciesForUser_shouldThrowExceptionWhenResponseIsNotSuccessful() throws Exception {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(new ResponseEntity<>(HttpStatus.BAD_REQUEST));
        service.evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");
    }

    /**
     * @verifies return true when actions is null
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnTrueWhenActionsIsNull() throws Exception {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(null)));

        boolean result = service.evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(Boolean.valueOf(result), is(Boolean.TRUE));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies returnSanitisedIpAddresses
     * @see PolicyService#getRequestIps(String)
     */
    @Test
    public void getRequestIps_shouldReturnSanitisedIpAddresses() throws Exception {
        List<String> actual;
        actual = service.getRequestIps(null);
        assertNull(actual);

        actual = service.getRequestIps("1.1.1.1");
        assertThat(actual, is(singletonList("1.1.1.1")));

        actual = service.getRequestIps("1.1.1.1:9999");
        assertThat(actual, is(singletonList("1.1.1.1")));

        actual = service.getRequestIps("1.1.1.1:1111, 2.2.2.2:2222, 3.3.3.3:3333");
        assertThat(actual, is(asList("1.1.1.1", "2.2.2.2", "3.3.3.3")));
    }
}