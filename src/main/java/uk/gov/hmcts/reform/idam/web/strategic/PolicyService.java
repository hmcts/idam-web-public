package uk.gov.hmcts.reform.idam.web.strategic;

import com.google.common.collect.ImmutableMap;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
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
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.netflix.zuul.constants.ZuulHeaders.X_FORWARDED_FOR;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static java.util.Optional.ofNullable;

@Slf4j
@Service
public class PolicyService {

    public enum EvaluatePoliciesAction {
        ALLOW,
        BLOCK,
        MFA_REQUIRED,
    }

    public static final String ERROR_POLICY_CHECK_EXCEPTION = "Policy check exception.";

    public static final String ADVICE_KEY_MFA_REQUIRED = "mfaRequired";
    public static final String ADVICE_KEY_MFA_REQUIRED_STRING_VALUE = "true";

    // Matches and captures ipv6 with port: 1fff:0:a88:85a3::ac1f
    // [1fff:0:a88:85a3::ac1f]:8001
    private static final Pattern IPV6_USING_BRACKETS_WITH_PORT_PATTERN = Pattern.compile("\\[(.+)\\].*");

    private final RestTemplate restTemplate;

    private final ConfigurationProperties configurationProperties;

    @Autowired
    public PolicyService(RestTemplate restTemplate, ConfigurationProperties configurationProperties) {
        this.restTemplate = restTemplate;
        this.configurationProperties = configurationProperties;
    }

    /**
     * @should return ALLOW when all actions return true
     * @should return ALLOW when no actions are returned
     * @should return ALLOW when actions is null
     * @should return MFA_REQUIRED when any action returns false and attribute mfaRequired is true
     * @should return BLOCK when any action returns false and attribute mfaRequired is not true
     * @should throw exception when response is not successful
     */
    public EvaluatePoliciesAction evaluatePoliciesForUser(final String uri, final List<String> cookies, final String ipAddress) {
        final String applicationName = configurationProperties.getStrategic().getPolicies().getApplicationName();

        final String idamSessionCookie = configurationProperties.getStrategic().getSession().getIdamSessionCookie();
        String sessionCookie = cookies.stream().
            filter(cookie -> cookie.contains(idamSessionCookie)).findFirst()
            .orElseThrow(() -> new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "No valid authentication token found."));

        final String userSsoToken = StringUtils.substringAfter(sessionCookie, "=");

        final EvaluatePoliciesRequest request = new EvaluatePoliciesRequest()
            .resources(singletonList(uri))
            .application(applicationName)
            .subject(new Subject().ssoToken(userSsoToken))
            .environment(ImmutableMap.of("requestIp", sanitiseIpsFromRequest(ipAddress)));

        final ResponseEntity<EvaluatePoliciesResponse> response = doEvaluatePolicies(cookies, userSsoToken, request, ipAddress);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new HttpClientErrorException(response.getStatusCode(), ERROR_POLICY_CHECK_EXCEPTION);
        }

        final EvaluatePoliciesAction result = checkNoActionsBlockingUser(response);
        return result;
    }

    private ResponseEntity<EvaluatePoliciesResponse> doEvaluatePolicies(final List<String> cookies,
                                                                        final String userSsoToken,
                                                                        final EvaluatePoliciesRequest request,
                                                                        final String ipAddress) {
        final HttpHeaders headers = new HttpHeaders();
        headers.add(X_FORWARDED_FOR, ipAddress);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.put(HttpHeaders.COOKIE, cookies);
        headers.setBearerAuth(userSsoToken);

        final HttpEntity<EvaluatePoliciesRequest> httpEntity = new HttpEntity<>(request, headers);
        final String url = String.format("%s/%s",
            configurationProperties.getStrategic().getService().getUrl(),
            configurationProperties.getStrategic().getEndpoint().getEvaluatePolicies());

        final ResponseEntity<EvaluatePoliciesResponse> response = restTemplate
            .exchange(url, HttpMethod.POST, httpEntity, EvaluatePoliciesResponse.class);

        return response;
    }

    private EvaluatePoliciesAction checkNoActionsBlockingUser(ResponseEntity<EvaluatePoliciesResponse> response) {

        EvaluatePoliciesAction action = EvaluatePoliciesAction.ALLOW;

        final EvaluatePoliciesResponse result = ofNullable(response.getBody())
            .orElse(new EvaluatePoliciesResponse());
        for (EvaluatePoliciesResponseInner resultItem : result) {
            final ActionMap actions = ofNullable(resultItem.getActions()).orElse(new ActionMap());
            final boolean block = actions.values().stream()
                .anyMatch(Boolean.FALSE::equals);
            if (block) {
                final boolean hasAttributes = resultItem.getAttributes() != null && resultItem.getAttributes() instanceof Map;
                final boolean mfaRequiredAttributeIsTrue = hasAttributes && asList(ADVICE_KEY_MFA_REQUIRED_STRING_VALUE)
                    .equals(((Map) resultItem.getAttributes()).get(ADVICE_KEY_MFA_REQUIRED));

                // if mfaRequired we downgrade action to mfa_required but still need to check for other possible
                // actions blocking the user even with mfa
                if (mfaRequiredAttributeIsTrue) {
                    action = EvaluatePoliciesAction.MFA_REQUIRED;
                } else {
                    return EvaluatePoliciesAction.BLOCK;
                }
            }
        }
        return action;
    }

    /**
     * Sanitise and returns request ips in a list of strings
     * Examples:
     * "1.1.1.1" => ["1.1.1.1"]
     * "51.140.12.192:59286" => ["51.140.12.192"]
     * "51.140.12.192:59286, 10.97.64.4:59250, 10.97.66.7:57249" => ["51.140.12.192", "10.97.64.4", "10.97.66.7"]
     * "2001:db8:85a3:8d3:1319:8a2e:370:7348" => ["2001:db8:85a3:8d3:1319:8a2e:370:7348"]
     * "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:1234" => ["2001:db8:85a3:8d3:1319:8a2e:370:7348"]
     *
     * @should break multiple ips and remove port
     */
    protected List<String> sanitiseIpsFromRequest(String ipAddress) {
        if (ipAddress == null) {
            return null;
        }
        final String[] splitArray = StringUtils.split(ipAddress, ",");
        return Arrays.stream(splitArray)
            .map(String::trim)
            .map(s -> {
                final boolean isIpv4 = StringUtils.countMatches(s, ":") < 2;
                if (isIpv4) {
                    // remove port if any
                    return StringUtils.substringBefore(s, ":");
                }
                final Matcher m = IPV6_USING_BRACKETS_WITH_PORT_PATTERN.matcher(s);
                final boolean isIpv6WithPort = m.matches();
                if (isIpv6WithPort) {
                    return m.group(1);
                }
                return s;
            })
            .collect(Collectors.toList());
    }

}
