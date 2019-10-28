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
     * @verifies return ALLOW when no actions are returned
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnALLOWWhenNoActionsAreReturned() throws Exception {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(new ActionMap())));

        final PolicyService.EvaluatePoliciesAction result = service
            .evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(result, is(PolicyService.EvaluatePoliciesAction.ALLOW));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies return ALLOW when all actions return true
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnALLOWWhenAllActionsReturnTrue() throws Exception {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(new ActionMap())));

        final PolicyService.EvaluatePoliciesAction result = service
            .evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(result, is(PolicyService.EvaluatePoliciesAction.ALLOW));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies return BLOCK when any action returns false and advice mfaRequired is not true
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnBLOCKWhenAnyActionReturnsFalseAndAdviceMfaRequiredIsNotTrue() throws Exception {
        final ActionMap actionMap = new ActionMap();
        actionMap.put("someKey", Boolean.TRUE);
        actionMap.put("anotherKey", Boolean.FALSE);
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(actionMap)));

        final PolicyService.EvaluatePoliciesAction result = service
            .evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(result, is(PolicyService.EvaluatePoliciesAction.BLOCK));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies return MFA_REQUIRED when any action returns false and advice mfaRequired is true
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnMFA_REQUIREDWhenAnyActionReturnsFalseAndAdviceMfaRequiredIsTrue() throws Exception {
        final ActionMap actionMap = new ActionMap();
        actionMap.put("someKey", Boolean.TRUE);
        actionMap.put("anotherKey", Boolean.FALSE);

        final EvaluatePoliciesResponseInner mockResponseInner = new EvaluatePoliciesResponseInner()
            .actions(actionMap)
            .advices(ImmutableMap.of("mfaRequired", asList("true")));

        final EvaluatePoliciesResponse mockResponse = new EvaluatePoliciesResponse();
        mockResponse.add(mockResponseInner);

        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse));

        final PolicyService.EvaluatePoliciesAction result = service
            .evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(result, is(PolicyService.EvaluatePoliciesAction.MFA_REQUIRED));

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
     * @verifies return ALLOW when actions is null
     * @see PolicyService#evaluatePoliciesForUser(String, String, String)
     */
    @Test
    public void evaluatePoliciesForUser_shouldReturnALLOWWhenActionsIsNull() throws Exception {
        given(restTemplate.exchange(anyString(), any(), any(), same(EvaluatePoliciesResponse.class)))
            .willReturn(ok(mockResponse(null)));

        final PolicyService.EvaluatePoliciesAction result = service
            .evaluatePoliciesForUser("someUri", "Idam.Session=someToken", "someIpAddress");

        assertThat(result, is(PolicyService.EvaluatePoliciesAction.ALLOW));

        verify(restTemplate).exchange(
            eq("idamApi/evaluatePolicies"),
            eq(HttpMethod.POST),
            eq(new HttpEntity<>(expectedRequest("someUri", "applicationName", "someToken", "someIpAddress"),
                expectedHeaders("someToken", "someIpAddress"))),
            eq(EvaluatePoliciesResponse.class));
    }

    /**
     * @verifies break multiple ips and remove port
     * @see PolicyService#sanitiseIpsFromRequest(String)
     */
    @Test
    public void sanitiseIpsFromRequest_shouldBreakMultipleIpsAndRemovePort() throws Exception {
        List<String> actual;

        actual = service.sanitiseIpsFromRequest(null);
        assertNull(actual);

        actual = service.sanitiseIpsFromRequest("1.1.1.1");
        assertThat(actual, is(singletonList("1.1.1.1")));

        actual = service.sanitiseIpsFromRequest("1.1.1.1:9999");
        assertThat(actual, is(singletonList("1.1.1.1")));

        actual = service.sanitiseIpsFromRequest("1.1.1.1:1111, 2.2.2.2:2222, 3.3.3.3:3333");
        assertThat(actual, is(asList("1.1.1.1", "2.2.2.2", "3.3.3.3")));

        actual = service.sanitiseIpsFromRequest("2001:db8:85a3:8d3:1319:8a2e:370:7348, 2001:db8:85a3:8d3:1319:8a2e:370:7348");
        assertThat(actual, is(asList("2001:db8:85a3:8d3:1319:8a2e:370:7348", "2001:db8:85a3:8d3:1319:8a2e:370:7348")));

        actual = service.sanitiseIpsFromRequest("[2001:db8:85a3:8d3:1319:8a2e:370:7348]:1234, 2001:db8:85a3:8d3:1319:8a2e:370:7348");
        assertThat(actual, is(asList("2001:db8:85a3:8d3:1319:8a2e:370:7348", "2001:db8:85a3:8d3:1319:8a2e:370:7348")));

        actual = service.sanitiseIpsFromRequest("[2001:db8:85a3:8d3:1319:8a2e:370:7348], 2001:db8:85a3:8d3:1319:8a2e:370:7348");
        assertThat(actual, is(asList("2001:db8:85a3:8d3:1319:8a2e:370:7348", "2001:db8:85a3:8d3:1319:8a2e:370:7348")));
    }

}