package uk.gov.hmcts.reform.idam.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import uk.gov.hmcts.reform.idam.api.internal.model.ActivationResult;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.web.model.SelfRegisterRequest;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;
import uk.gov.hmcts.reform.idam.web.strategic.ValidationService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ALREADY_ACTIVATED_KEY;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.BASE64_ENC_FORM_DATA;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENTID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CODE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_BLACKLISTED_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_CAPITAL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_CONTAINS_PERSONAL_INFO_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_ENTER_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_INVALID_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_LABEL_ONE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_LABEL_TWO;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_MESSAGE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_MSG;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_TITLE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIREDTOKEN_REDIRECTED_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIREDTOKEN_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIRED_ACTIVATION_TOKEN_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORM_DATA;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.GENERIC_ERROR_KEY;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.GOOGLE_WEB_ADDRESS;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.MISSING;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.NOT_FOUND_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_BLACKLISTED_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_CONTAINS_PERSONAL_INFO_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECTURI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTER_COMMAND;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTER_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTER_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SERVICE_LABEL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TOKEN_INVALID_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TOKEN_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USERS_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USERS_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATED_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATION_CODE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATION_TOKEN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_ACTIVATION_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_CREATED_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.VALIDATE_TOKEN_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getActivateUserPostRequest;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getActivationResult;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getSelfRegisterPostRequest;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.getService;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class UserControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ValidationService validationService;

    @MockBean
    private SPIService spiService;

    /**
     * @verifies return expiredtoken view and  have redirect_uri attribute in model  if token expired
     * @see UserController#userActivation(String, String, java.util.Map)
     */
    @Test
    public void userActivation_shouldReturnExpiredtokenViewAndHaveRedirect_uriAttributeInModelIfTokenExpired() throws Exception {
        ActivationResult activationResult = getActivationResult("", GOOGLE_WEB_ADDRESS, CLIENT_ID_PARAMETER);
        given(spiService.validateActivationToken(ArgumentMatchers.any())).willReturn(ResponseEntity.ok(activationResult));

        mockMvc.perform(get(VALIDATE_TOKEN_ENDPOINT)
            .param(TOKEN_PARAMETER, USER_ACTIVATION_TOKEN)
            .param(CODE_PARAMETER, USER_ACTIVATION_CODE))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(model().attribute(REDIRECT_URI, "/users/selfRegister?redirect_uri=" + GOOGLE_WEB_ADDRESS +
                "&client_id=" + CLIENT_ID_PARAMETER))
            .andExpect(view().name(EXPIRED_ACTIVATION_TOKEN_VIEW_NAME));

    }

    /**
     * @verifies return useractivation view and no redirect_uri attribute in model if the token is valid
     * @see UserController#userActivation(String, String, java.util.Map)
     */
    @Test
    public void userActivation_shouldReturnUseractivationViewAndNoRedirect_uriAttributeInModelIfTheTokenIsValid() throws Exception {
        given(spiService.validateActivationToken(ArgumentMatchers.any())).willReturn(new ResponseEntity<>(HttpStatus.OK));

        mockMvc.perform(get(VALIDATE_TOKEN_ENDPOINT)
            .param(TOKEN_PARAMETER, USER_ACTIVATION_TOKEN)
            .param(CODE_PARAMETER, USER_ACTIVATION_CODE))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(model().attribute(REDIRECT_URI, nullValue()))
            .andExpect(view().name(USER_ACTIVATION_VIEW_NAME));
    }

    /**
     * @verifies return errorpage view error message and no redirect_uri attribute in model if api returns server error
     * @see UserController#userActivation(String, String, java.util.Map)
     */
    @Test
    public void userActivation_shouldReturnErrorpageViewErrorMessageAndNoRedirect_uriAttributeInModelIfApiReturnsServerError() throws Exception {
        given(spiService.validateActivationToken(ArgumentMatchers.any())).willThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(get(VALIDATE_TOKEN_ENDPOINT)
            .param(TOKEN_PARAMETER, USER_ACTIVATION_TOKEN)
            .param(CODE_PARAMETER, USER_ACTIVATION_CODE))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(model().attribute(REDIRECT_URI, nullValue()))
            .andExpect(model().attribute(ERROR_MSG, GENERIC_ERROR_KEY))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return errorpage view error message for alredy activated account and no redirect_uri attribute in model if api returns status 409
     * @see UserController#userActivation(String, String, java.util.Map)
     */
    @Test
    public void userActivation_shouldReturnErrorpageViewErrorMessageForAlredyActivatedAccountAndNoRedirect_uriAttributeInModelIfApiReturnsStatus409() throws Exception {
        given(spiService.validateActivationToken(ArgumentMatchers.any())).willThrow(new HttpServerErrorException(HttpStatus.CONFLICT));

        mockMvc.perform(get(VALIDATE_TOKEN_ENDPOINT)
            .param(TOKEN_PARAMETER, USER_ACTIVATION_TOKEN)
            .param(CODE_PARAMETER, USER_ACTIVATION_CODE))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(model().attribute(REDIRECT_URI, nullValue()))
            .andExpect(model().attribute(ERROR_MSG, ALREADY_ACTIVATED_KEY))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return selfRegister view if request mandatory fields validation fails
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnSelfRegisterViewIfRequestMandatoryFieldsValidationFails() throws Exception {
        mockMvc.perform(getSelfRegisterPostRequest(USER_EMAIL, USER_FIRST_NAME, ""))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));
    }

    /**
     * @verifies return selfRegister view if email field is invalid
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnSelfRegisterViewIfEmailFieldIsInvalid() throws Exception {

        mockMvc.perform(getSelfRegisterPostRequest(MISSING, USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval!d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval(d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval)d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval%d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval&d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(getSelfRegisterPostRequest("inval;d@email.com", USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        verify(spiService, never()).selfRegisterUser(any(SelfRegisterRequest.class));
    }

    /**
     * @verifies return usercreated view  if selfRegisterUser service returns http status 200
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnUsercreatedViewIfSelfRegisterUserServiceReturnsHttpStatus200() throws Exception {
        given(spiService.selfRegisterUser(any(SelfRegisterRequest.class))).willReturn(ResponseEntity.status(HttpStatus.OK).build());

        mockMvc.perform(getSelfRegisterPostRequest(USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(model().attribute(USER_EMAIL_PARAMETER, USER_EMAIL))
            .andExpect(view().name(USER_CREATED_VIEW_NAME));
    }

    /**
     * @verifies return errorpage  view and error message in model if selfRegisterUser service throws HttpClientErrorException and Http code is not 409
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnErrorpageViewAndErrorMessageInModelIfSelfRegisterUserServiceThrowsHttpClientErrorExceptionAndHttpCodeIsNot409() throws Exception {
        given(spiService.selfRegisterUser(any(SelfRegisterRequest.class))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        mockMvc.perform(getSelfRegisterPostRequest(USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR_MSG, GENERIC_ERROR_KEY))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return errorpage view and error message in model if selfRegisterUser service throws HttpServerErrorException
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnErrorpageViewAndErrorMessageInModelIfSelfRegisterUserServiceThrowsHttpServerErrorException() throws Exception {
        given(spiService.selfRegisterUser(any(SelfRegisterRequest.class))).willThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(getSelfRegisterPostRequest(USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR_MSG, GENERIC_ERROR_KEY))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return usercreated view  if selfRegisterUser service throws HttpClientErrorException and Http code is 409
     * @see UserController#selfRegisterUser(SelfRegisterRequest, org.springframework.validation.BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void selfRegisterUser_shouldReturnUsercreatedViewIfSelfRegisterUserServiceThrowsHttpClientErrorExceptionAndHttpCodeIs409() throws Exception {
        given(spiService.selfRegisterUser(any(SelfRegisterRequest.class))).willThrow(new HttpClientErrorException(HttpStatus.CONFLICT));

        mockMvc.perform(getSelfRegisterPostRequest(USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME))
            .andExpect(status().isOk())
            .andExpect(view().name(USER_CREATED_VIEW_NAME));
    }

    /**
     * @verifies return useractivated view and redirect uri in model if returned by spiService if request mandatory fields validation succeeds
     * @see UserController#activateUser(String, String, String, String, java.util.Map)
     */
    @Test
    public void activateUser_shouldReturnUseractivatedViewAndRedirectUriInModelIfReturnedBySpiServiceIfRequestMandatoryFieldsValidationSucceeds() throws Exception {

        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}"))).willReturn(ResponseEntity.ok("{\"redirectUri\":\"" + REDIRECT_URI + "\"}"));

        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().is3xxRedirection())
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(USER_ACTIVATED_VIEW_NAME));
    }

    /**
     * @verifies return useractivation view and blacklisted password error in model if HttpClientErrorException occurs and http status is 400 and password is blacklisted
     * @see UserController#activateUser(String, String, String, String, java.util.Map)
     */
    @Test
    public void activateUser_shouldReturnUseractivationViewAndBlacklistedPasswordErrorInModelIfHttpClientErrorExceptionOccursAndHttpStatusIs400AndPasswordIsBlacklisted() throws Exception {
        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}"))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bad Request", PASSWORD_BLACKLISTED_RESPONSE.getBytes(), null));
        given(validationService.isErrorInResponse(eq(PASSWORD_BLACKLISTED_RESPONSE), eq(ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED))).willReturn(true);
        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_BLACKLISTED_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_BLACKLISTED_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_TWO, ERROR_ENTER_PASSWORD))
            .andExpect(view().name(USER_ACTIVATION_VIEW_NAME));
    }

    /**
     * @verifies return useractivation view and password contains personal info error in model if HttpClientErrorException occurs and http status is 400 and password contains personal info
     * @see UserController#activateUser(String, String, String, String, Map)
     */
    @Test
    public void activateUser_shouldReturnUseractivationViewAndPasswordContainsPersonalInfoErrorInModelIfHttpClientErrorExceptionOccursAndHttpStatusIs400AndPasswordContainsPersonalInfo() throws Exception {
        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}")))
            .willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bad Request", PASSWORD_CONTAINS_PERSONAL_INFO_RESPONSE.getBytes(), null));
        given(validationService.isErrorInResponse(eq(PASSWORD_CONTAINS_PERSONAL_INFO_RESPONSE), eq(ErrorResponse.CodeEnum.PASSWORD_CONTAINS_PERSONAL_INFO)))
            .willReturn(true);
        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_CONTAINS_PERSONAL_INFO_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_CONTAINS_PERSONAL_INFO_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_TWO, ERROR_ENTER_PASSWORD))
            .andExpect(view().name(USER_ACTIVATION_VIEW_NAME));
    }

    /**
     * @verifies return expiredtoken view if HttpClientErrorException occurs and http status is 400 and token is invalid
     * @see UserController#activateUser(String, String, String, String, Map)
     */
    @Test
    public void activateUser_shouldReturnExpiredtokenViewIfHttpClientErrorExceptionOccursAndHttpStatusIs400AndTokenIsInvalid() throws Exception {
        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}"))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bad Request", TOKEN_INVALID_RESPONSE.getBytes(), null));
        given(validationService.isErrorInResponse(eq(TOKEN_INVALID_RESPONSE), eq(ErrorResponse.CodeEnum.TOKEN_INVALID))).willReturn(true);
        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().is3xxRedirection())
            .andExpect(view().name(EXPIREDTOKEN_VIEW_NAME));
    }

    /**
     * @verifies return useractivation view and invalid passowrd error in model if HttpClientErrorException occurs and http status is 400 and password is not blacklisted
     * @see UserController#activateUser(String, String, String, String, java.util.Map)
     */
    @Test
    public void activateUser_shouldReturnUseractivationViewAndInvalidPassowrdErrorInModelIfHttpClientErrorExceptionOccursAndHttpStatusIs400AndPasswordIsNotBlacklisted() throws Exception {
        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}"))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_INVALID_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_INVALID_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_TWO, ERROR_ENTER_PASSWORD))
            .andExpect(view().name(USER_ACTIVATION_VIEW_NAME));
    }

    /**
     * @verifies return redirect expiredtoken page if selfRegisterUser service throws HttpClientErrorException and Http code is 404
     * @see UserController#activateUser(String, String, String, String, java.util.Map)
     */
    @Test
    public void activateUser_shouldReturnRedirectExpiredtokenPageIfSelfRegisterUserServiceThrowsHttpClientErrorExceptionAndHttpCodeIs404() throws Exception {
        given(validationService.validatePassword(eq(USER_PASSWORD), eq(USER_PASSWORD), any(Map.class))).willReturn(true);
        given(spiService.activateUser(eq("{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + USER_PASSWORD + "\"}"))).willThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        mockMvc.perform(getActivateUserPostRequest(USER_ACTIVATION_TOKEN, USER_ACTIVATION_CODE, USER_PASSWORD, USER_PASSWORD))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl(EXPIREDTOKEN_REDIRECTED_VIEW_NAME));

    }

    /**
     * @verifies return users view
     * @see UserController#users(Map)
     */
    @Test
    public void users_shouldReturnUsersView() throws Exception {
        mockMvc.perform(get(USERS_ENDPOINT))
            .andExpect(status().isOk())
            .andExpect(view().name(USERS_VIEW_NAME));
    }


    /**
     * @verifies call spi service with correct parameter then return selfRegister view and  have redirect_uri, selfRegisterCommand, client_id attributes in model if self registration is allowed for service
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldCallSpiServiceWithCorrectParameterThenReturnSelfRegisterViewAndHaveRedirect_uriSelfRegisterCommandClient_idAttributesInModelIfSelfRegistrationIsAllowedForService() throws Exception {

        given(spiService.getServiceByClientId(eq(SERVICE_CLIENT_ID))).willReturn(Optional.of(getService(SERVICE_LABEL, SERVICE_CLIENT_ID, true)));

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(SELF_REGISTER_COMMAND, notNullValue()))
            .andExpect(model().attribute(REDIRECTURI, GOOGLE_WEB_ADDRESS))
            .andExpect(model().attribute(CLIENTID_PARAMETER, SERVICE_CLIENT_ID))
            .andExpect(model().attribute(STATE_PARAMETER, STATE))
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        verify(spiService).getServiceByClientId(eq(SERVICE_CLIENT_ID));
    }

    /**
     * @verifies return 404 view if clientId or redirectUri are missing
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldReturn404ViewIfClientIdOrRedirectUriAreMissing() throws Exception {
        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(view().name(NOT_FOUND_VIEW));
    }

    /**
     * @verifies return generic error with generic error message if an exception is thrown
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldReturnGenericErrorWithGenericErrorMessageIfAnExceptionIsThrown() throws Exception {
        given(spiService.getServiceByClientId(eq(SERVICE_CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bad Request", TOKEN_INVALID_RESPONSE.getBytes(), null));

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR_MSG, GENERIC_ERROR_KEY))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return 404 view if service is empty
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldReturn404ViewIfServiceIsEmpty() throws Exception {
        given(spiService.getServiceByClientId(eq(SERVICE_CLIENT_ID))).willReturn(Optional.empty());

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(view().name(NOT_FOUND_VIEW));
    }

    /**
     * @verifies return 404 view if self registration is not allowed
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldReturn404ViewIfSelfRegistrationIsNotAllowed() throws Exception {
        given(spiService.getServiceByClientId(eq(SERVICE_CLIENT_ID))).willReturn(Optional.of(getService(SERVICE_LABEL, SERVICE_CLIENT_ID, false)));

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(view().name(NOT_FOUND_VIEW));
    }

    /**
     * @verifies populate the model with the users details if called with a valid form_data param
     * @see UserController#selfRegister(String, String, String, String, String, org.springframework.ui.Model)
     */
    @Test
    public void selfRegister_shouldPopulateTheModelWithTheUsersDetailsIfCalledWithAValidForm_dataParam() throws Exception {
        given(spiService.getServiceByClientId(eq(SERVICE_CLIENT_ID)))
            .willReturn(Optional.of(getService(SERVICE_LABEL, SERVICE_CLIENT_ID, true)));

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(FORM_DATA, BASE64_ENC_FORM_DATA)
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(model().attribute("firstName", "John"))
            .andExpect(model().attribute("lastName", "Doe"))
            .andExpect(model().attribute("email", "john.doe@email.com"))
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));

        mockMvc.perform(get(SELF_REGISTER_ENDPOINT)
            .param(FORM_DATA, "1234567890")
            .param(REDIRECT_URI, GOOGLE_WEB_ADDRESS)
            .param(CLIENT_ID_PARAMETER, SERVICE_CLIENT_ID)
            .param(STATE_PARAMETER, STATE))
            .andExpect(status().isOk())
            .andExpect(model().attribute("firstName", nullValue()))
            .andExpect(model().attribute("lastName", nullValue()))
            .andExpect(model().attribute("email", nullValue()))
            .andExpect(view().name(SELF_REGISTER_VIEW_NAME));
    }

    /**
     * @verifies return null if redirecturi or clientid are empty
     * @see UserController#buildRegistrationLink(ActivationResult)
     */
    @Test
    public void buildRegistrationLink_shouldReturnNullIfRedirecturiOrClientidAreEmpty() throws Exception {
        UserController userController = new UserController();
        assertNull(userController.buildRegistrationLink(new ActivationResult()));
        assertNull(userController.buildRegistrationLink(new ActivationResult().redirectUri(GOOGLE_WEB_ADDRESS)));
        assertNull(userController.buildRegistrationLink(new ActivationResult().clientId(CLIENT_ID)));
    }

    /**
     * @verifies build link if redirecturi and clientid are present
     * @see UserController#buildRegistrationLink(ActivationResult)
     */
    @Test
    public void buildRegistrationLink_shouldBuildLinkIfRedirecturiAndClientidArePresent() throws Exception {
        UserController userController = new UserController();
        assertThat(
            userController.buildRegistrationLink(
                new ActivationResult().redirectUri(GOOGLE_WEB_ADDRESS).clientId(CLIENT_ID)),
            is("/users/selfRegister?redirect_uri=https://www.google.com&client_id=clientId"));
    }

    @Test
    public void userActivated_shouldReturnCorrectValue() {
        UserController userController = new UserController();
        String result;
        Map<String, Object> model = new HashMap<>();

        result = userController.userActivated(null, model);
        assertEquals("useractivated", result);
        assertTrue(model.isEmpty());

        model.clear();
        result = userController.userActivated("uri", model);
        assertEquals("useractivated", result);
        assertEquals(1, model.size());
        assertEquals("uri", model.get("redirectUri"));
    }

    @Test
    public void expiredToken_shouldReturnCorrectValue() {
        UserController userController = new UserController();
        assertEquals("expiredtoken", userController.expiredToken(null));
    }
}
