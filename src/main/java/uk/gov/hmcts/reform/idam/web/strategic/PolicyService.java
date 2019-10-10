package uk.gov.hmcts.reform.idam.web.strategic;

import com.google.common.collect.ImmutableMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import uk.gov.hmcts.reform.idam.api.external.model.ActionMap;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesRequest;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesResponse;
import uk.gov.hmcts.reform.idam.api.external.model.EvaluatePoliciesResponseInner;
import uk.gov.hmcts.reform.idam.api.external.model.Subject;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import java.util.Collections;

import static java.util.Collections.singletonList;
import static java.util.Optional.ofNullable;

@Slf4j
@Service
public class PolicyService {

    public static final String ERROR_POLICY_CHECK_EXCEPTION = "Policy check exception.";

    private final RestTemplate restTemplate;

    private final ConfigurationProperties configurationProperties;

    @Autowired
    public PolicyService(RestTemplate restTemplate, ConfigurationProperties configurationProperties) {
        this.restTemplate = restTemplate;
        this.configurationProperties = configurationProperties;
    }

    /**
     * @should return true when all actions return true
     * @should return false when any action returns false
     * @should throw exception when response is not successful
     * @should return true when no actions are returned
     * @should return true when actions is null
     */
    public boolean evaluatePoliciesForUser(final String uri, final String cookie, final String ipAddress) {
        final String applicationName = configurationProperties.getStrategic().getPolicies().getApplicationName();

        final String userSsoToken = StringUtils.substringAfter(cookie, "=");

        final EvaluatePoliciesRequest request = new EvaluatePoliciesRequest()
            .resources(singletonList(uri))
            .application(applicationName)
            .subject(new Subject().ssoToken(userSsoToken))
            .environment(ImmutableMap.of("requestIp", singletonList(ipAddress)));

        final ResponseEntity<EvaluatePoliciesResponse> response = doEvaluatePolicies(cookie, userSsoToken, request);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new HttpClientErrorException(response.getStatusCode(), ERROR_POLICY_CHECK_EXCEPTION);
        }

        final boolean result = checkNoActionsBlockingUser(response);
        return result;
    }

    private ResponseEntity<EvaluatePoliciesResponse> doEvaluatePolicies(final String cookie, final String userSsoToken, final EvaluatePoliciesRequest request) {
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.put(HttpHeaders.COOKIE, Collections.singletonList(cookie));
        headers.setBearerAuth(userSsoToken);

        final HttpEntity<EvaluatePoliciesRequest> httpEntity = new HttpEntity<>(request, headers);
        final String url = String.format("%s/%s",
            configurationProperties.getStrategic().getService().getUrl(),
            configurationProperties.getStrategic().getEndpoint().getEvaluatePolicies());

        final ResponseEntity<EvaluatePoliciesResponse> response = restTemplate
            .exchange(url, HttpMethod.POST, httpEntity, EvaluatePoliciesResponse.class);

        return response;
    }

    private boolean checkNoActionsBlockingUser(ResponseEntity<EvaluatePoliciesResponse> response) {
        final EvaluatePoliciesResponse result = ofNullable(response.getBody())
            .orElse(new EvaluatePoliciesResponse());
        for (EvaluatePoliciesResponseInner resultItem : result) {
            final ActionMap actions = ofNullable(resultItem.getActions()).orElse(new ActionMap());
            final boolean block = actions.values().stream()
                .anyMatch(Boolean.FALSE::equals);
            if (block) {
                return false;
            }
        }
        return true;
    }

}
