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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static com.netflix.zuul.constants.ZuulHeaders.X_FORWARDED_FOR;
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
            .environment(ImmutableMap.of("requestIp", getRequestIps(ipAddress)));

        final ResponseEntity<EvaluatePoliciesResponse> response = doEvaluatePolicies(cookie, userSsoToken, request, ipAddress);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new HttpClientErrorException(response.getStatusCode(), ERROR_POLICY_CHECK_EXCEPTION);
        }

        final boolean result = checkNoActionsBlockingUser(response);
        return result;
    }

    private ResponseEntity<EvaluatePoliciesResponse> doEvaluatePolicies(final String cookie,
                                                                        final String userSsoToken,
                                                                        final EvaluatePoliciesRequest request,
                                                                        final String ipAddress) {
        final HttpHeaders headers = new HttpHeaders();
        headers.add(X_FORWARDED_FOR, ipAddress);
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

    /**
     * Sanitise and return request ips in a list of strings
     * Examples:
     * "1.1.1.1" => ["1.1.1.1"]
     * "51.140.12.192:59286" => ["51.140.12.192"]
     * "51.140.12.192:59286, 10.97.64.4:59250, 10.97.66.7:57249" => ["51.140.12.192", "10.97.64.4", "10.97.66.7"]
     *
     * @should returnSanitisedIpAddresses
     */
    protected List<String> getRequestIps(String ipAddress) {
        if (ipAddress == null) {
            return null;
        }
        final String[] splitArray = StringUtils.split(ipAddress, ",");
        return Arrays.asList(splitArray).stream()
            .map(String::trim)
            .map(s -> StringUtils.substringBefore(s, ":"))
            .collect(Collectors.toList());
    }

}
