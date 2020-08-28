package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.collect.ImmutableMap;
import org.hamcrest.CoreMatchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import uk.gov.hmcts.reform.idam.api.internal.model.ActivationResult;
import uk.gov.hmcts.reform.idam.api.internal.model.ArrayOfServices;
import uk.gov.hmcts.reform.idam.api.internal.model.ForgotPasswordDetails;
import uk.gov.hmcts.reform.idam.api.internal.model.ResetPasswordRequest;
import uk.gov.hmcts.reform.idam.api.internal.model.Service;
import uk.gov.hmcts.reform.idam.api.internal.model.ValidateRequest;
import uk.gov.hmcts.reform.idam.api.shared.model.SelfRegisterRequest;
import uk.gov.hmcts.reform.idam.api.shared.model.User;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.health.HealthCheckStatus;
import uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.google.common.net.HttpHeaders.X_FORWARDED_FOR;
import static java.util.Collections.singletonList;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ACTIVATE_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ACTIVATE_USER_REQUEST;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.API_LOGIN_UPLIFT_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.API_URL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.AUTHENTICATE_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.AUTHORIZATION_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.AUTHORIZATION_TOKEN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENTID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CODE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CUSTOM_SCOPE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.DETAILS_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_SPI_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.GOOGLE_WEB_ADDRESS;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.HEALTH_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.JWT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.JWT_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.MISSING;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.OAUTH2_AUTHORIZE_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_ONE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECTURI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_CODE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_TOKEN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SCOPE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTRATION_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTRATION_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTRATION_URL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICES_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_LABEL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_OAUTH2_CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_OAUTH2_REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SLASH;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TOKEN_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USERNAME_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USERS_SELF_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATION_CODE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATION_TOKEN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_IP_ADDRESS;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.VALIDATE_RESET_PASSWORD_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.VALIDATE_TOKEN_API_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.anAuthorizedUser;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getFoundResponseEntity;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getSelfRegisterRequest;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getService;

@RunWith(MockitoJUnitRunner.class)
public class SPIServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ConfigurationProperties configurationProperties;

    @InjectMocks
    private SPIService spiService;

    @Captor
    private ArgumentCaptor<HttpEntity<?>> captor;

    @Before
    public void setUp() {
        given(configurationProperties.getStrategic().getService().getUrl()).willReturn(API_URL);
        given(configurationProperties.getStrategic().getEndpoint().getAuthorize()).willReturn(AUTHENTICATE_ENDPOINT);
        given(configurationProperties.getStrategic().getEndpoint().getSelfRegisterUser()).willReturn(USERS_SELF_ENDPOINT);
        given(configurationProperties.getStrategic().getEndpoint().getResetPassword()).willReturn(RESET_PASSWORD_ENDPOINT);
        given(configurationProperties.getStrategic().getEndpoint().getForgotPassword()).willReturn(FORGOT_PASSWORD_SPI_ENDPOINT);
        given(configurationProperties.getStrategic().getEndpoint().getUplift()).willReturn(API_LOGIN_UPLIFT_ENDPOINT);
        given(configurationProperties.getStrategic().getEndpoint().getAuthorizeOauth2()).willReturn(OAUTH2_AUTHORIZE_ENDPOINT);
    }

    /**
     * @verifies call correct endpoint to register user
     * @see SPIService#registerUser(RegisterUserRequest)
     */
    @Test
    public void registerUser_shouldCallCorrectEndpointToRegisterUser() throws Exception {
        // when
        spiService.registerUser(aRegisterUserRequest());

        // then
        verify(restTemplate).exchange(eq(SELF_REGISTRATION_URL), any(HttpMethod.class), any(HttpEntity.class), any(Class.class));
    }

    /**
     * @verifies register user with correct details
     * @see SPIService#registerUser(RegisterUserRequest)
     */
    @Test
    public void registerUser_shouldRegisterUserWithCorrectDetails() throws Exception {
        // when
        spiService.registerUser(aRegisterUserRequest());

        // then
        ArgumentCaptor<HttpEntity<SelfRegisterRequest>> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(eq(SELF_REGISTRATION_URL), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<SelfRegisterRequest> actualRequest = captor.getValue();

        assertThat(actualRequest.getBody().getEmail(), CoreMatchers.is(USER_EMAIL));
        assertThat(actualRequest.getBody().getFirstName(), CoreMatchers.is(USER_FIRST_NAME));
        assertThat(actualRequest.getBody().getLastName(), CoreMatchers.is(USER_LAST_NAME));
        assertThat(actualRequest.getBody().getClientId(), CoreMatchers.is(SERVICE_OAUTH2_CLIENT_ID));
        assertThat(actualRequest.getBody().getRedirectUri(), CoreMatchers.is(SERVICE_OAUTH2_REDIRECT_URI));
    }

    /**
     * @verifies return what API call returns
     * @see SPIService#registerUser(RegisterUserRequest)
     */
    @Test
    public void registerUser_shouldReturnWhatAPICallReturns() throws Exception {
        // given
        ResponseEntity<String> expectedResponse = ResponseEntity.ok().build();

        given(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .willReturn(expectedResponse);

        // when
        ResponseEntity<String> actualResponse = spiService.registerUser(aRegisterUserRequest());

        // then
        assertThat(actualResponse, is(expectedResponse));
    }

    /**
     * @verifies call IDM with the right  body
     * @see SPIService#validateActivationToken(ValidateRequest)
     */
    @Test
    public void validateActivationToken_shouldCallIDMWithTheRightBody() throws Exception {

        given(configurationProperties.getStrategic().getEndpoint().getValidateActivationToken()).willReturn(VALIDATE_TOKEN_API_ENDPOINT);

        spiService.validateActivationToken(new ValidateRequest().token(USER_ACTIVATION_TOKEN).code(USER_ACTIVATION_CODE));

        verify(restTemplate)
            .exchange(eq(API_URL + "/" + VALIDATE_TOKEN_API_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(ActivationResult.class));

        HttpEntity<ValidateRequest> entity = (HttpEntity<ValidateRequest>) captor.getAllValues().get(0);

        Assert.assertEquals(entity.getBody().getToken(), USER_ACTIVATION_TOKEN);
        Assert.assertEquals(entity.getBody().getCode(), USER_ACTIVATION_CODE);
    }

    /**
     * @verifies call correct endpoint to reset password
     * @see SPIService#resetPassword(String, String, String)
     */
    @Test
    public void resetPassword_shouldCallCorrectEndpointToResetPassword() throws Exception {
        // given

        // when
        spiService.resetPassword(
            USER_PASSWORD,
            RESET_PASSWORD_TOKEN,
            RESET_PASSWORD_CODE);

        // then
        verify(restTemplate).exchange(eq(RESET_PASSWORD_URI), any(HttpMethod.class), any(HttpEntity.class), any(Class.class));
    }

    /**
     * @verifies register user with correct details
     * @see SPIService#resetPassword(String, String, String)
     */
    @Test
    public void resetPassword_shouldRegisterUserWithCorrectDetails() throws Exception {
        // given
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        resetPasswordRequest.setCode(RESET_PASSWORD_CODE);
        resetPasswordRequest.setToken(RESET_PASSWORD_TOKEN);
        resetPasswordRequest.setPassword(USER_PASSWORD);

        // when
        spiService.resetPassword(
            USER_PASSWORD,
            RESET_PASSWORD_TOKEN,
            RESET_PASSWORD_CODE);

        // then
        ArgumentCaptor<HttpEntity<ResetPasswordRequest>> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(eq(RESET_PASSWORD_URI), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<ResetPasswordRequest> actualRequest = captor.getValue();

        assertThat(actualRequest.getBody().getToken(), CoreMatchers.is(RESET_PASSWORD_TOKEN));
        assertThat(actualRequest.getBody().getCode(), CoreMatchers.is(RESET_PASSWORD_CODE));
        assertThat(actualRequest.getBody().getPassword(), CoreMatchers.is(USER_PASSWORD));
    }

    /**
     * @verifies return what API call returns
     * @see SPIService#resetPassword(String, String, String)
     */
    @Test
    public void resetPassword_shouldReturnWhatAPICallReturns() throws Exception {
        // given
        ResponseEntity<String> expectedResponse = ResponseEntity.ok().build();

        given(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), any(Class.class)))
            .willReturn(expectedResponse);

        // when
        ResponseEntity<String> actualResponse = spiService.resetPassword(
            USER_PASSWORD,
            RESET_PASSWORD_TOKEN,
            RESET_PASSWORD_CODE);

        // then
        assertThat(actualResponse, is(expectedResponse));
    }

    /**
     * @verifies call api with the correct parameters
     * @see SPIService#forgetPassword(String, String, String)
     */
    @Test
    public void forgetPassword_shouldCallApiWithTheCorrectParameters() throws Exception {
        spiService.forgetPassword(USER_EMAIL, SERVICE_OAUTH2_REDIRECT_URI, CLIENT_ID);
        Thread.sleep(1000); // hack to get around CompletableFuture.supplyAsync()

        ArgumentCaptor<HttpEntity<ForgotPasswordDetails>> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).exchange(eq(FORGOT_PASSWORD_URI), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<ForgotPasswordDetails> actualRequest = captor.getValue();

        assertEquals(USER_EMAIL, actualRequest.getBody().getEmail());
        assertEquals(SERVICE_OAUTH2_REDIRECT_URI, actualRequest.getBody().getRedirectUri());
        assertEquals(CLIENT_ID, actualRequest.getBody().getClientId());
    }

    /**
     * @verifies return 202 status code
     * @see SPIService#forgetPassword(String, String, String)
     */
    @Test
    public void forgetPassword_shouldReturn202StatusCode() throws Exception {
        ResponseEntity<String> response = spiService.forgetPassword(USER_EMAIL, SERVICE_OAUTH2_REDIRECT_URI, CLIENT_ID);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
    }

    /**
     * @verifies call api with the correct data
     * @see SPIService#activateUser(String)
     */
    @Test
    public void activateUser_shouldCallApiWithTheCorrectData() throws Exception {

        given(configurationProperties.getStrategic().getEndpoint().getActivation()).willReturn(ACTIVATE_ENDPOINT);

        spiService.activateUser(ACTIVATE_USER_REQUEST);

        verify(restTemplate).exchange(eq(API_URL + SLASH + ACTIVATE_ENDPOINT), eq(HttpMethod.PATCH), captor.capture(), eq(ActivationResult.class));

        HttpEntity<?> entity = captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_JSON_VALUE));
        assertThat(entity.getBody(), equalTo(ACTIVATE_USER_REQUEST));

    }

    /**
     * @verifies return api location in header in api response if response code is 302
     * @see SPIService#uplift(String, String, String, String, String, String, String)
     */
    @Test
    public void uplift_shouldReturnApiLocationInHeaderInApiResponseIfResponseCodeIs302() throws Exception {

        given(restTemplate.exchange(eq(API_URL + SLASH + API_LOGIN_UPLIFT_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(getFoundResponseEntity(GOOGLE_WEB_ADDRESS));

        String result = spiService.uplift(USER_EMAIL, PASSWORD_ONE, JWT, REDIRECT_URI, CLIENT_ID, STATE, MISSING);

        assertThat(result, equalTo(GOOGLE_WEB_ADDRESS));

    }

    /**
     * @verifies call api with the correct data and return api response body if response code is 200
     * @see SPIService#uplift(String, String, String, String, String, String, String)
     */
    @Test
    public void uplift_shouldCallApiWithTheCorrectDataAndReturnApiResponseBodyIfResponseCodeIs200() throws Exception {
        given(restTemplate.exchange(eq(API_URL + SLASH + API_LOGIN_UPLIFT_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(ResponseEntity.ok(GOOGLE_WEB_ADDRESS));

        String result = spiService.uplift(USER_EMAIL, PASSWORD_ONE, JWT, REDIRECT_URI, CLIENT_ID, STATE, MISSING);

        assertThat(result, equalTo(GOOGLE_WEB_ADDRESS));

        verify(restTemplate).exchange(eq(API_URL + SLASH + API_LOGIN_UPLIFT_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<MultiValueMap<String, String>> entity = (HttpEntity<MultiValueMap<String, String>>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_FORM_URLENCODED_VALUE));

        MultiValueMap<String, String> form = entity.getBody();

        assertThat(form.getFirst(USER_NAME), equalTo(USER_EMAIL));
        assertThat(form.getFirst(PASSWORD_PARAMETER), equalTo(PASSWORD_ONE));
        assertThat(form.getFirst(JWT_PARAMETER), equalTo(JWT));
        assertThat(form.getFirst(CLIENTID_PARAMETER), equalTo(CLIENT_ID));
        assertThat(form.getFirst(STATE_PARAMETER), equalTo(STATE));
    }

    /**
     * @verifies return null if api response code is not 200 nor 302
     * @see SPIService#uplift(String, String, String, String, String, String, String)
     */
    @Test
    public void uplift_shouldReturnNullIfApiResponseCodeIsNot200Nor302() throws Exception {
        given(restTemplate.exchange(eq(API_URL + SLASH + API_LOGIN_UPLIFT_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(ResponseEntity.status(HttpStatus.NOT_MODIFIED).build());

        String result = spiService.uplift(USER_EMAIL, PASSWORD_ONE, JWT, REDIRECT_URI, CLIENT_ID, STATE, MISSING);

        assertThat(result, is(nullValue()));

        verify(restTemplate).exchange(eq(API_URL + SLASH + API_LOGIN_UPLIFT_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class));
    }

    /**
     * @verifies call api with the correct data and return location in header in api response if response code is 302
     * @see SPIService#authorize(Map, List)
     */
    @Test
    public void authorize_shouldCallApiWithTheCorrectDataAndReturnLocationInHeaderInApiResponseIfResponseCodeIs302() throws Exception {
        given(restTemplate.exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(getFoundResponseEntity(GOOGLE_WEB_ADDRESS));

        String result = spiService.authorize(ImmutableMap.<String, String>builder()
            .put(USERNAME_PARAMETER, USER_EMAIL)
            .put(PASSWORD_PARAMETER, PASSWORD_ONE)
            .put(REDIRECT_URI, REDIRECTURI)
            .put(STATE_PARAMETER, STATE)
            .put(CLIENT_ID_PARAMETER, CLIENT_ID)
            .put(SCOPE_PARAMETER, CUSTOM_SCOPE).build(), null);

        assertThat(result, equalTo(GOOGLE_WEB_ADDRESS));

        verify(restTemplate).exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<MultiValueMap<String, String>> entity = (HttpEntity<MultiValueMap<String, String>>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_FORM_URLENCODED_VALUE));

        MultiValueMap<String, String> form = entity.getBody();

        assertThat(form.getFirst(USERNAME_PARAMETER), equalTo(USER_EMAIL));
        assertThat(form.getFirst(PASSWORD_PARAMETER), equalTo(PASSWORD_ONE));
        assertThat(form.getFirst(REDIRECT_URI), equalTo(REDIRECTURI));
        assertThat(form.getFirst(STATE_PARAMETER), equalTo(STATE));
        assertThat(form.getFirst(CLIENT_ID_PARAMETER), equalTo(CLIENT_ID));

    }

    /**
     * @verifies return null if api response code is not 302
     * @see SPIService#authorize(Map, List)
     */
    @Test
    public void authorize_shouldReturnNullIfApiResponseCodeIsNot302() throws Exception {
        given(restTemplate.exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(ResponseEntity.ok().build());

        String result = spiService.authorize(ImmutableMap.<String, String>builder()
            .put(USERNAME_PARAMETER, USER_EMAIL)
            .put(PASSWORD_PARAMETER, PASSWORD_ONE)
            .put(REDIRECT_URI, REDIRECTURI)
            .put(STATE_PARAMETER, STATE)
            .put(CLIENT_ID_PARAMETER, CLIENT_ID).build(), null);

        assertThat(result, is(nullValue()));

        verify(restTemplate).exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class));
    }

    /**
     * @verifies not send state and scope parameters in form if they are not send as parameter in the service
     * @see SPIService#authorize(Map, List)
     */
    @Test
    public void authorize_shouldNotSendStateAndScopeParametersInFormIfTheyAreNotSendAsParameterInTheService() throws Exception {

        given(restTemplate.exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(getFoundResponseEntity(GOOGLE_WEB_ADDRESS));

        spiService.authorize(ImmutableMap.<String, String>builder()
            .put(USERNAME_PARAMETER, USER_EMAIL)
            .put(PASSWORD_PARAMETER, PASSWORD_ONE)
            .put(REDIRECT_URI, REDIRECTURI)
            .put(CLIENT_ID_PARAMETER, CLIENT_ID).build(), null);

        verify(restTemplate).exchange(eq(API_URL + SLASH + OAUTH2_AUTHORIZE_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<MultiValueMap<String, String>> entity = (HttpEntity<MultiValueMap<String, String>>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_FORM_URLENCODED_VALUE));

        MultiValueMap<String, String> form = entity.getBody();

        assertThat(form.getFirst(USERNAME_PARAMETER), equalTo(USER_EMAIL));
        assertThat(form.getFirst(PASSWORD_PARAMETER), equalTo(PASSWORD_ONE));
        assertThat(form.getFirst(REDIRECT_URI), equalTo(REDIRECTURI));
        assertThat(form.getFirst(STATE_PARAMETER), is(nullValue()));
        assertThat(form.getFirst(SCOPE_PARAMETER), is(nullValue()));
        assertThat(form.getFirst(CLIENT_ID_PARAMETER), equalTo(CLIENT_ID));

    }

    /**
     * @verifies call api with the correct data
     * @see SPIService#validateResetPasswordToken(String, String)
     */
    @Test
    public void validateResetPasswordToken_shouldCallApiWithTheCorrectData() throws Exception {
        given(configurationProperties.getStrategic().getEndpoint().getValidateResetPasswordToken()).willReturn(VALIDATE_RESET_PASSWORD_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + VALIDATE_RESET_PASSWORD_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(ResponseEntity.ok().build());

        spiService.validateResetPasswordToken(RESET_PASSWORD_TOKEN, RESET_PASSWORD_CODE);

        verify(restTemplate).exchange(eq(API_URL + SLASH + VALIDATE_RESET_PASSWORD_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<Void> entity = (HttpEntity<Void>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_JSON_VALUE));

        assertThat(entity.getHeaders().getFirst(TOKEN_PARAMETER), equalTo(RESET_PASSWORD_TOKEN));
        assertThat(entity.getHeaders().getFirst(CODE_PARAMETER), equalTo(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies call api with the correct data
     * @see SPIService#selfRegisterUser(uk.gov.hmcts.reform.idam.web.model.SelfRegisterRequest)
     */
    @Test
    public void selfRegisterUser_shouldCallApiWithTheCorrectData() throws Exception {

        given(configurationProperties.getStrategic().getEndpoint().getSelfRegistration()).willReturn(SELF_REGISTRATION_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + SELF_REGISTRATION_ENDPOINT), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).willReturn(ResponseEntity.ok().build());

        spiService.selfRegisterUser(getSelfRegisterRequest());

        verify(restTemplate).exchange(eq(API_URL + SLASH + SELF_REGISTRATION_ENDPOINT), eq(HttpMethod.POST), captor.capture(), eq(String.class));

        HttpEntity<String> entity = (HttpEntity<String>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_JSON_VALUE));
        assertThat(entity.getBody(), equalTo(SELF_REGISTRATION_RESPONSE));

    }

    /**
     * @verifies call api with the correct data and return api response if status code is 200
     * @see SPIService#getDetails(String)
     */
    @Test
    public void getDetails_shouldCallApiWithTheCorrectDataAndReturnApiResponseIfStatusCodeIs200() throws Exception {

        User user = anAuthorizedUser();
        given(configurationProperties.getStrategic().getEndpoint().getDetails()).willReturn(DETAILS_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + DETAILS_ENDPOINT), eq(HttpMethod.GET), any(HttpEntity.class), eq(User.class))).willReturn(ResponseEntity.ok(user));

        Optional<User> response = spiService.getDetails(AUTHORIZATION_TOKEN);

        assertThat(response.get(), equalTo(user));

        verify(restTemplate).exchange(eq(API_URL + SLASH + DETAILS_ENDPOINT), eq(HttpMethod.GET), captor.capture(), eq(User.class));

        HttpEntity<String> entity = (HttpEntity<String>) captor.getValue();

        assertThat(entity.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE), equalTo(MediaType.APPLICATION_JSON_VALUE));
        assertThat(entity.getHeaders().getFirst(AUTHORIZATION_PARAMETER), equalTo(AUTHORIZATION_TOKEN));
        assertThat(entity.getBody(), equalTo("parameters"));
    }

    /**
     * @verifies return optional empty if status code is not 200
     * @see SPIService#getDetails(String)
     */
    @Test
    public void getDetails_shouldReturnOptionalEmptyIfStatusCodeIsNot200() throws Exception {

        given(configurationProperties.getStrategic().getEndpoint().getDetails()).willReturn(DETAILS_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + DETAILS_ENDPOINT), eq(HttpMethod.GET), any(HttpEntity.class), eq(User.class))).willReturn(ResponseEntity.accepted().build());

        Optional<User> response = spiService.getDetails(AUTHORIZATION_TOKEN);

        assertThat(response, equalTo(Optional.empty()));

    }

    /**
     * @verifies return optional empty if any Exception occurs
     * @see SPIService#getDetails(String)
     */
    @Test
    public void getDetails_shouldReturnOptionalEmptyIfAnyExceptionOccurs() throws Exception {
        given(configurationProperties.getStrategic().getEndpoint().getDetails()).willReturn(DETAILS_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + DETAILS_ENDPOINT), eq(HttpMethod.GET), any(HttpEntity.class), eq(User.class))).willThrow(new HttpClientErrorException(HttpStatus.FORBIDDEN));

        Optional<User> response = spiService.getDetails(AUTHORIZATION_TOKEN);

        assertThat(response, equalTo(Optional.empty()));

    }

    /**
     * @verifies call api with the correct data and return the service if api response is not empty and http status code is 200
     * @see SPIService#getServiceByClientId(String)
     */
    @Test
    public void getServiceByClientId_shouldCallApiWithTheCorrectDataAndReturnTheServiceIfApiResponseIsNotEmptyAndHttpStatusCodeIs200() {
        Service service = getService(SERVICE_LABEL, SERVICE_CLIENT_ID, true);

        ArrayOfServices services = new ArrayOfServices();
        services.add(service);

        given(configurationProperties.getStrategic().getEndpoint().getServices()).willReturn(SERVICES_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + SERVICES_ENDPOINT + "?clientId=" + SERVICE_CLIENT_ID), eq(HttpMethod.GET), any(HttpEntity.class), eq(ArrayOfServices.class))).willReturn(ResponseEntity.ok(services));

        Optional<Service> response = spiService.getServiceByClientId(SERVICE_CLIENT_ID);

        assertThat(response.get(), equalTo(service));

        verify(restTemplate).exchange(eq(API_URL + SLASH + SERVICES_ENDPOINT + "?clientId=" + SERVICE_CLIENT_ID), eq(HttpMethod.GET), captor.capture(), eq(ArrayOfServices.class));

    }

    /**
     * @verifies return Optional empty if api returns an http status different from 200
     * @see SPIService#getServiceByClientId(String)
     */
    @Test
    public void getServiceByClientId_shouldReturnOptionalEmptyIfApiReturnsAnHttpStatusDifferentFrom200() {

        given(configurationProperties.getStrategic().getEndpoint().getServices()).willReturn(SERVICES_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + SERVICES_ENDPOINT + "?clientId=" + SERVICE_CLIENT_ID), eq(HttpMethod.GET), any(HttpEntity.class), eq(ArrayOfServices.class))).willReturn(ResponseEntity.badRequest().build());

        Optional<Service> response = spiService.getServiceByClientId(SERVICE_CLIENT_ID);

        assertThat(response.isPresent(), is(false));

    }

    /**
     * @verifies return Optional empty if api returns empty response body
     * @see SPIService#getServiceByClientId(String)
     */
    @Test
    public void getServiceByClientId_shouldReturnOptionalEmptyIfApiReturnsEmptyResponseBody() throws Exception {
        given(configurationProperties.getStrategic().getEndpoint().getServices()).willReturn(SERVICES_ENDPOINT);
        given(restTemplate.exchange(eq(API_URL + SLASH + SERVICES_ENDPOINT + "?clientId=" + SERVICE_CLIENT_ID), eq(HttpMethod.GET), any(HttpEntity.class), eq(ArrayOfServices.class))).willReturn(ResponseEntity.ok().build());

        Optional<Service> response = spiService.getServiceByClientId(SERVICE_CLIENT_ID);

        assertThat(response.isPresent(), is(false));
    }

    /**
     * @verifies call api health check
     * @see SPIService#healthCheck()
     */
    @Test
    public void healthCheck_shouldCallApiHealthCheck() {
        given(configurationProperties.getStrategic().getEndpoint().getHealth()).willReturn(HEALTH_ENDPOINT);
        given(restTemplate.getForEntity(API_URL + SLASH + HEALTH_ENDPOINT, HealthCheckStatus.class)).willReturn(ResponseEntity.ok(new HealthCheckStatus("UP")));

        ResponseEntity<HealthCheckStatus> response = spiService.healthCheck();

        assertThat(response.getBody().getStatus(), equalTo("UP"));
    }

    private RegisterUserRequest aRegisterUserRequest() {
        RegisterUserRequest registerUserRequest = new RegisterUserRequest();
        registerUserRequest.setClient_id(SERVICE_OAUTH2_CLIENT_ID);
        registerUserRequest.setRedirect_uri(SERVICE_OAUTH2_REDIRECT_URI);
        registerUserRequest.setFirstName(USER_FIRST_NAME);
        registerUserRequest.setLastName(USER_LAST_NAME);
        registerUserRequest.setJwt(JWT);
        registerUserRequest.setUsername(USER_EMAIL);
        registerUserRequest.setState(STATE);
        return registerUserRequest;
    }

    /**
     * @see SPIService#authenticate(String, String, String, String)
     */
    @Test
    public void authenticate_shouldReturnSessionCookieOnSuccess() throws JsonProcessingException {
        String cookie = "Idam.Session=1234567890";
        given(restTemplate.exchange(eq(API_URL + SLASH + AUTHENTICATE_ENDPOINT),
            eq(HttpMethod.POST), any(HttpEntity.class), eq(Object.class)))
            .willReturn(ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie).build());
        ApiAuthResult result = spiService.authenticate(USER_NAME, PASSWORD_ONE, REDIRECT_URI, USER_IP_ADDRESS);
        assertTrue(result.getCookies().contains(cookie));
    }

    /**
     * @see SPIService#authenticate(String, String, String, String)
     */
    @Test
    public void authenticate_shouldNotReturnSessionCookie() throws JsonProcessingException {
        given(restTemplate.exchange(eq(API_URL + SLASH + AUTHENTICATE_ENDPOINT),
            eq(HttpMethod.POST), any(HttpEntity.class), eq(Object.class)))
            .willReturn(ResponseEntity.ok().build());
        ApiAuthResult result = spiService.authenticate(USER_NAME, PASSWORD_ONE, REDIRECT_URI, USER_IP_ADDRESS);
        assertTrue(result.getCookies().isEmpty());
    }
}
