package uk.gov.hmcts.reform.idam.web;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ACTION_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.AUTHORIZE_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.BLANK;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENTID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CODE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.DO_RESET_PASSWORD_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_BLACKLISTED_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_CAPITAL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_ENTER_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_INVALID_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_LABEL_ONE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_LABEL_TWO;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_MESSAGE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_MSG;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_PASSWORD_DETAILS;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_PREVIOUSLY_USED_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_TITLE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERROR_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERR_LOCKED_FAILED_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ERR_SUSPENDED_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIREDTOKEN_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIRED_TOKEN_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.EXPIRED_TOKEN_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_COMMAND_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_SUCCESS_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.FORGOT_PASSWORD_WEB_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.HAS_LOGIN_FAILED;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.HAS_LOGIN_FAILED_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.INDEX_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.INFORMATION_IS_MISSING_OR_INVALID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.IS_ACCOUNT_LOCKED;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.IS_ACCOUNT_SUSPENDED;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.JWT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.JWT_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_LOGOUT_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_PIN_CODE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_PIN_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_UPLIFT_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_WITH_PIN_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGIN_WITH_PIN_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.LOGOUT_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.MISSING;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_BLACKLISTED_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_ONE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_RESET_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_TWO;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PIN_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PIN_USER_NOT_LONGER_VALID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PLEASE_FIX_THE_FOLLOWING;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PLEASE_TRY_AGAIN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECTURI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REGISTER_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REGISTER_USER_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REGISTER_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESETPASSWORD_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_FORGOT_PASSWORD_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_CODE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_RESPONSE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_SUCCESS_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESET_PASSWORD_TOKEN;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESPONSE_TYPE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.RESPONSE_TYPE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SECURITY_CODE_INCORRECT_ERROR;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTRATION_ENABLED;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SORRY_THERE_WAS_AN_ERROR;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TACTICAL_ACTIVATE_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TACTICAL_ACTIVATE_VIEW;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TOKEN_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.UNUSED;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.UPLIFT_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.UPLIFT_USER_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USERNAME_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_CREATED_VIEW_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL_INVALID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_PASSWORD;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.VALID_SECURITY_CODE_ERROR;
import static uk.gov.hmcts.reform.idam.web.util.TestHelper.anAuthorizedUser;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.BindingResult;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import uk.gov.hmcts.reform.idam.api.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.api.model.Service;
import uk.gov.hmcts.reform.idam.api.model.User;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;
import uk.gov.hmcts.reform.idam.web.strategic.ValidationService;

@RunWith(SpringRunner.class)
@WebMvcTest(AppController.class)
public class AppControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SPIService spiService;

    @MockBean
    private ValidationService validationService;


    /**
     * @verifies return index view
     * @see AppController#index(Map)
     */
    @Test
    public void index_shouldReturnIndexView() throws Exception {
        mockMvc.perform(get("/"))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(view().name(INDEX_VIEW));
    }

    /**
     * @verifies put correct data in model and return login view
     * @see AppController#login(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void login_shouldPutCorrectDataInModelAndReturnLoginView() throws Exception {

        Service service = new Service();
        service.selfRegistrationAllowed(true);

        given(spiService.getServiceByClientId(CLIENT_ID)).willReturn(Optional.of(service));

        mockMvc.perform(get(LOGIN_ENDPOINT)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(model().attribute(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE))
            .andExpect(model().attribute(STATE_PARAMETER, STATE))
            .andExpect(model().attribute(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(model().attribute(REDIRECT_URI, REDIRECT_URI))
            .andExpect(view().name(LOGIN_VIEW));
    }

    /**
     * @verifies set self-registration to false if disabled for the service
     * @see AppController#login(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test public void login_shouldSetSelfRegistrationToFalseIfDisabledForTheService() throws Exception {

        Service service = new Service();
        service.selfRegistrationAllowed(false);

        given(spiService.getServiceByClientId(CLIENT_ID)).willReturn(Optional.of(service));

        mockMvc.perform(get(LOGIN_ENDPOINT)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
			.andExpect(model().attribute(SELF_REGISTRATION_ENABLED, false))
            .andExpect(view().name(LOGIN_VIEW));
    }

    /**
     * @verifies set self-registration to false if the clientId is invalid
     * @see AppController#login(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test public void login_shouldSetSelfRegistrationToFalseIfTheClientIdIsInvalid() throws Exception {

        given(spiService.getServiceByClientId(CLIENT_ID)).willReturn(Optional.empty());

        mockMvc.perform(get(LOGIN_ENDPOINT)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
			.andExpect(model().attribute(SELF_REGISTRATION_ENABLED, false))
            .andExpect(view().name(LOGIN_VIEW));
    }

    /**
     * @verifies return expired token view
     * @see AppController#expiredtoken(Map)
     */
    @Test
    public void expiredtoken_shouldReturnExpiredTokenView() throws Exception {
        mockMvc.perform(get(EXPIRED_TOKEN_ENDPOINT))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(view().name(EXPIREDTOKEN_VIEW_NAME));
    }

    /**
     * @verifies return login with pin view
     * @see AppController#loginWithPin(Map)
     */
    @Test
    public void loginWithPin_shouldReturnLoginWithPinView() throws Exception {
        mockMvc.perform(get(LOGIN_PIN_ENDPOINT))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(view().name(LOGIN_WITH_PIN_VIEW));
    }

    /**
     * @verifies put right error data in model if mandatory fields are missing and return upliftUser view
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test
    public void registerUser_shouldPutRightErrorDataInModelIfMandatoryFieldsAreMissingAndReturnUpliftUserView() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, MISSING)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));
    }

    /**
     * @verifies return upliftUser view if register user service returns http code different from 201
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test
    public void registerUser_shouldReturnUpliftUserViewIfRegisterUserServiceReturnsHttpCodeDifferentFrom201() throws Exception {

        given(spiService.registerUser(eq(USER_FIRST_NAME), eq(USER_LAST_NAME), eq(USER_EMAIL), eq(JWT), eq(REDIRECT_URI), eq(CLIENT_ID))).willReturn(ResponseEntity.badRequest().build());

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));
    }

    /**
     * @verifies put email in model and return usercreated view if register user service returns http code 201
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test
    public void registerUser_shouldPutEmailInModelAndReturnUsercreatedViewIfRegisterUserServiceReturnsHttpCode201() throws Exception {
        given(spiService.registerUser(eq(USER_FIRST_NAME), eq(USER_LAST_NAME), eq(USER_EMAIL), eq(JWT), eq(REDIRECT_URI), eq(CLIENT_ID))).willReturn(ResponseEntity.status(HttpStatus.CREATED).build());

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(USER_EMAIL_PARAMETER, USER_EMAIL))
            .andExpect(view().name(USER_CREATED_VIEW_NAME));
    }


    /**
     * @verifies put right error data in model if register user service throws HttpClientErrorException with 404 http status code
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test
    public void registerUser_shouldPutRightErrorDataInModelIfRegisterUserServiceThrowsHttpClientErrorExceptionWith404HttpStatusCode() throws Exception {
        given(spiService.registerUser(eq(USER_FIRST_NAME), eq(USER_LAST_NAME), eq(USER_EMAIL), eq(JWT), eq(REDIRECT_URI), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, SORRY_THERE_WAS_AN_ERROR))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_TRY_AGAIN + PIN_USER_NOT_LONGER_VALID))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

    }

    /**
     * @verifies put generic error data in model if register user service throws HttpClientErrorException an http status code different from 404
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test
    public void registerUser_shouldPutGenericErrorDataInModelIfRegisterUserServiceThrowsHttpClientErrorExceptionAnHttpStatusCodeDifferentFrom404() throws Exception {
        given(spiService.registerUser(eq(USER_FIRST_NAME), eq(USER_LAST_NAME), eq(USER_EMAIL), eq(JWT), eq(REDIRECT_URI), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, SORRY_THERE_WAS_AN_ERROR))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_TRY_AGAIN))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

    }

    /**
     * @verifies reject request if the username is invalid
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheUsernameIsInvalid() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL_INVALID)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

    }

    /**
     * @verifies reject request if the first name is missing
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheFirstNameIsMissing() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, MISSING)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

    }

    /**
     * @verifies reject request if the last name is missing
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheLastNameIsMissing() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, MISSING)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));
    }

    /**
     * @verifies reject request if the jwt is missing
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheJwtIsMissing() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, MISSING)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));
    }

    /**
     * @verifies reject request if the redirect URI is missing
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheRedirectURIIsMissing() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, MISSING)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, MISSING))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

    }

    /**
     * @verifies reject request if the clientId is missing
     * @see AppController#registerUser(uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest, org.springframework.validation.BindingResult, Map, org.springframework.web.servlet.mvc.support.RedirectAttributes)
     */
    @Test public void registerUser_shouldRejectRequestIfTheClientIdIsMissing() throws Exception {

        mockMvc.perform(post(REGISTER_USER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, MISSING)
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(USER_FIRST_NAME_PARAMETER, USER_FIRST_NAME)
            .param(USER_LAST_NAME_PARAMETER, USER_LAST_NAME)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, INFORMATION_IS_MISSING_OR_INVALID))
            .andExpect(model().attribute(ERROR_MESSAGE, PLEASE_FIX_THE_FOLLOWING))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));
    }

    /**
     * @verifies uplift user
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldUpliftUser() throws Exception {

        given(spiService.uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE)).willReturn("upliftResult");

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isFound())
            .andExpect(view().name("redirect:upliftResult"));

        verify(spiService).uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE);
    }

    /**
     * @verifies reject request if username is not provided
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfUsernameIsNotProvided() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, MISSING)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies reject request if username is invalid
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfUsernameIsInvalid() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval!d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval(d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval)d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval%d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval&d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, "inval;d@email.com")
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies reject request if password is not provided
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfPasswordIsNotProvided() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, MISSING)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies reject request if JWT is not provided
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfJWTIsNotProvided() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, MISSING)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies reject request if redirectUri is not provided
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfRedirectUriIsNotProvided() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, MISSING)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies reject request if clientId is not provided
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldRejectRequestIfClientIdIsNotProvided() throws Exception {

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, MISSING))
            .andExpect(status().isBadRequest());

        verify(spiService, never()).uplift(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
    }

    /**
     * @verifies return to the registration page if the credentials are invalid
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldReturnToTheRegistrationPageIfTheCredentialsAreInvalid() throws Exception {

        given(spiService.uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE))
            .willThrow(new HttpClientErrorException(HttpStatus.UNAUTHORIZED));

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(view().name(REGISTER_VIEW_NAME));

        verify(spiService).uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE);
    }

    /**
     * @verifies return error page view if OAuth2 details are missing
     * @see AppController#login(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void login_shouldReturnErrorPageViewIfOAuth2DetailsAreMissing() throws Exception {
        mockMvc.perform(post(LOGIN_ENDPOINT).with(csrf())
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(CLIENT_ID_PARAMETER, MISSING))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR_MSG, "error.page.access.denied"))
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies return to the registration page if there is an exception
     * @see AppController#uplift(uk.gov.hmcts.reform.idam.web.model.UpliftRequest, Map, org.springframework.ui.ModelMap)
     */
    @Test public void uplift_shouldReturnToTheRegistrationPageIfThereIsAnException() throws Exception {

        given(spiService.uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE)).willThrow(new RuntimeException());

        mockMvc.perform(post(UPLIFT_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(JWT_PARAMETER, JWT)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(view().name(REGISTER_VIEW_NAME));

        verify(spiService).uplift(USER_EMAIL, USER_PASSWORD, JWT, REDIRECT_URI, CLIENT_ID, STATE);
    }

    /**
     * @verifies return user uplift page if the user is authorized
     * @see AppController#uplift(String, Map)
     */
    @Test public void uplift_shouldReturnUserUpliftPageIfTheUserIsAuthorized() throws Exception {

        given(spiService.getDetails(JWT)).willReturn(Optional.of(anAuthorizedUser()));

        mockMvc.perform(post(LOGIN_UPLIFT_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT))
            .andExpect(status().isOk())
            .andExpect(view().name(UPLIFT_USER_VIEW_NAME));

        verify(spiService).getDetails(JWT);
    }

    /**
     * @verifies return error page if the user is not authorized
     * @see AppController#uplift(String, Map)
     */
    @Test public void uplift_shouldReturnErrorPageIfTheUserIsNotAuthorized() throws Exception {

        given(spiService.getDetails(JWT)).willReturn(Optional.of(new User()));

        mockMvc.perform(post(LOGIN_UPLIFT_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT))
            .andExpect(status().isOk())
            .andExpect(view().name(ERROR_VIEW_NAME));

        verify(spiService).getDetails(JWT);
    }

    /**
     * @verifies return user registration page if the user is authorized
     * @see AppController#selfRegister(String, Map)
     */
    @Test public void selfRegister_shouldReturnUserRegistrationPageIfTheUserIsAuthorized() throws Exception {

        given(spiService.getDetails(JWT)).willReturn(Optional.of(anAuthorizedUser()));

        mockMvc.perform(post(REGISTER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT))
            .andExpect(status().isOk())
            .andExpect(view().name(REGISTER_VIEW_NAME));

        verify(spiService).getDetails(JWT);
    }

    /**
     * @verifies return error page if the user is not authorized
     * @see AppController#selfRegister(String, Map)
     */
    @Test public void selfRegister_shouldReturnErrorPageIfTheUserIsNotAuthorized() throws Exception {

        given(spiService.getDetails(JWT)).willReturn(Optional.of(new User()));

        mockMvc.perform(post(REGISTER_ENDPOINT).with(csrf())
            .param(JWT_PARAMETER, JWT))
            .andExpect(status().isOk())
            .andExpect(view().name(ERROR_VIEW_NAME));

        verify(spiService).getDetails(JWT);
    }

    /**
     * @verifies redirect to reset password page if token is valid
     * @see AppController#passwordReset(String, String, String)
     */
    @Test public void passwordReset_shouldRedirectToResetPasswordPageIfTokenIsValid() throws Exception {

        given(spiService.validateResetPasswordToken(RESET_PASSWORD_TOKEN, RESET_PASSWORD_CODE)).willReturn(ResponseEntity.ok("{irrelevant}"));

        mockMvc.perform(post(PASSWORD_RESET_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(view().name(RESETPASSWORD_VIEW_NAME));

        verify(spiService).validateResetPasswordToken(RESET_PASSWORD_TOKEN, RESET_PASSWORD_CODE);
    }

    /**
     * @verifies redirect to token expired page if token is invalid
     * @see AppController#passwordReset(String, String, String)
     */
    @Test public void passwordReset_shouldRedirectToTokenExpiredPageIfTokenIsInvalid() throws Exception {

        given(spiService.validateResetPasswordToken(RESET_PASSWORD_TOKEN, RESET_PASSWORD_CODE)).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        mockMvc.perform(post(PASSWORD_RESET_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(view().name(EXPIRED_TOKEN_VIEW_NAME));

        verify(spiService).validateResetPasswordToken(RESET_PASSWORD_TOKEN, RESET_PASSWORD_CODE);
    }

    /**
     * @verifies put in model redirect uri if service returns http 200 and redirect uri is present in response then return reset password success view
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldPutInModelRedirectUriIfServiceReturnsHttp200AndRedirectUriIsPresentInResponseThenReturnResetPasswordSuccessView() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(true);
        given(spiService.resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE))).willReturn(ResponseEntity.ok(RESET_PASSWORD_RESPONSE));

        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(REDIRECTURI, REDIRECTURI))
            .andExpect(view().name(RESET_PASSWORD_SUCCESS_VIEW));

        verify(spiService).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies put in model the correct error code if HttpClientErrorException with http 412 is thrown by service then return reset password view.
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldPutInModelTheCorrectErrorCodeIfHttpClientErrorExceptionWithHttp412IsThrownByServiceThenReturnResetPasswordView() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(true);
        given(spiService.resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE))).willThrow(new HttpClientErrorException(HttpStatus.PRECONDITION_FAILED));


        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_INVALID_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_PASSWORD_DETAILS))
            .andExpect(model().attribute(ERROR_LABEL_TWO, BLANK))
            .andExpect(view().name(RESETPASSWORD_VIEW_NAME));

        verify(spiService).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password is blacklisted then return reset password view.
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldPutInModelTheCorrectErrorCodeIfHttpClientErrorExceptionWithHttp400IsThrownByServiceAndPasswordIsBlacklistedThenReturnResetPasswordView() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(true);
        given(spiService.resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.name(), PASSWORD_BLACKLISTED_RESPONSE.getBytes(), null));
        given(validationService.isErrorInResponse(eq(PASSWORD_BLACKLISTED_RESPONSE), eq(ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED))).willReturn(true);


        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_BLACKLISTED_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_PASSWORD_DETAILS))
            .andExpect(model().attribute(ERROR_LABEL_TWO, ERROR_ENTER_PASSWORD))
            .andExpect(view().name(RESETPASSWORD_VIEW_NAME));

        verify(spiService).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password is previously used then return reset password view.
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldPutInModelTheCorrectErrorCodeIfHttpClientErrorExceptionWithHttp400IsThrownByServiceAndPasswordIsPreviouslyUsedThenReturnResetPasswordView() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(true);
        given(spiService.resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.name(), ERR_LOCKED_FAILED_RESPONSE.getBytes(), null));
        given(validationService.isErrorInResponse(eq(ERR_LOCKED_FAILED_RESPONSE), eq(ErrorResponse.CodeEnum.ACCOUNT_LOCKED))).willReturn(true);


        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, ERROR_CAPITAL))
            .andExpect(model().attribute(ERROR_MESSAGE, ERROR_PREVIOUSLY_USED_PASSWORD))
            .andExpect(model().attribute(ERROR_LABEL_ONE, ERROR_PASSWORD_DETAILS))
            .andExpect(model().attribute(ERROR_LABEL_TWO, ERROR_ENTER_PASSWORD))
            .andExpect(view().name(RESETPASSWORD_VIEW_NAME));

        verify(spiService).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies redirect to expired token if HttpClientErrorException with http 404 is thrown by service.
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldRedirectToExpiredTokenIfHttpClientErrorExceptionWithHttp404IsThrownByService() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(true);
        given(spiService.resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE))).willThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));


        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl(EXPIRED_TOKEN_VIEW_NAME));

        verify(spiService).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }

    /**
     * @verifies return reset password view if request validation fails.
     * @see AppController#resetPassword(String, String, String, String, String, Map)
     */
    @Test
    public void resetPassword_shouldReturnResetPasswordViewIfRequestValidationFails() throws Exception {
        given(validationService.validateResetPasswordRequest(eq(PASSWORD_ONE), eq(PASSWORD_TWO), any(Map.class))).willReturn(false);

        mockMvc.perform(post(DO_RESET_PASSWORD_ENDPOINT).with(csrf())
            .param(ACTION_PARAMETER, UNUSED)
            .param(PASSWORD_ONE, PASSWORD_ONE)
            .param(PASSWORD_TWO, PASSWORD_TWO)
            .param(TOKEN_PARAMETER, RESET_PASSWORD_TOKEN)
            .param(CODE_PARAMETER, RESET_PASSWORD_CODE))
            .andExpect(status().isOk())
            .andExpect(view().name(RESETPASSWORD_VIEW_NAME));

        verify(spiService, never()).resetPassword(eq(PASSWORD_ONE), eq(RESET_PASSWORD_TOKEN), eq(RESET_PASSWORD_CODE));
    }


    /**
     * @verifies call forget password with the right parameters
     * @see AppController#forgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest, org.springframework.validation.BindingResult, Map)
     */
    @Test
    public void forgotPassword_shouldCallForgetPasswordWithTheRightParameters() throws Exception {
        mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, USER_EMAIL)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk());

        verify(spiService).forgetPassword(USER_EMAIL, REDIRECT_URI, CLIENT_ID);
        verifyNoMoreInteractions(spiService);
    }

    /**
     * @verifies not call forget password if there are validation errors
     * @see AppController#forgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest, org.springframework.validation.BindingResult, Map)
     */
    @Test
    public void forgotPassword_shouldNotCallForgetPasswordIfThereAreValidationErrors()
        throws Exception {
        mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, USER_EMAIL_INVALID))
            .andExpect(status().isOk())
            .andExpect(view().name(FORGOT_PASSWORD_VIEW));

        verifyZeroInteractions(spiService);
    }

    /**
     * @verifies return forgot password success view when there are no errors
     * @see AppController#forgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest, org.springframework.validation.BindingResult, Map)
     */
    @Test
    public void forgotPassword_shouldReturnForgotPasswordSuccessViewWhenThereAreNoErrors()
        throws Exception {
        mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, USER_EMAIL)
            .param(REDIRECTURI, REDIRECT_URI)
            .param(CLIENTID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(view().name(FORGOT_PASSWORD_SUCCESS_VIEW))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(model().attribute(CLIENTID_PARAMETER, CLIENT_ID));
    }

    /**
     * @verifies return forgot password view with correct model data when there are validation errors
     * @see AppController#forgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest, org.springframework.validation.BindingResult, Map)
     */
    @Test
    public void forgotPassword_shouldReturnForgotPasswordViewWithCorrectModelDataWhenThereAreValidationErrors()
        throws Exception {
        BindingResult bindingResultForInvalidEmail = (BindingResult) mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, USER_EMAIL_INVALID))
            .andExpect(status().isOk())
            .andExpect(view().name(FORGOT_PASSWORD_VIEW))
            .andExpect(model().attribute(USER_EMAIL_PARAMETER, USER_EMAIL_INVALID))
            .andReturn()
            .getModelAndView()
            .getModelMap()
            .get("org.springframework.validation.BindingResult." + FORGOT_PASSWORD_COMMAND_NAME);

        List<String> errorCodesForInvalidEmail = bindingResultForInvalidEmail.getFieldErrors(USER_EMAIL_PARAMETER).stream()
            .flatMap(fieldError -> Arrays.stream(fieldError.getCodes()))
            .collect(Collectors.toList());

        assertThat(errorCodesForInvalidEmail, hasItem("Email.forgotPasswordCommand.email"));

        BindingResult bindingResultForBlankEmail = (BindingResult) mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, MISSING))
            .andExpect(status().isOk())
            .andExpect(view().name(FORGOT_PASSWORD_VIEW))
            .andReturn()
            .getModelAndView()
            .getModelMap()
            .get("org.springframework.validation.BindingResult." + FORGOT_PASSWORD_COMMAND_NAME);

        List<String> errorCodesForBlankEmail = bindingResultForBlankEmail.getFieldErrors(USER_EMAIL_PARAMETER).stream()
            .flatMap(fieldError -> Arrays.stream(fieldError.getCodes()))
            .collect(Collectors.toList());

        assertThat(errorCodesForBlankEmail, hasItems("NotEmpty.forgotPasswordCommand.email", "Email.forgotPasswordCommand.email"));
    }

    /**
     * @verifies return error view when there is an unexpected error
     * @see AppController#forgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest, org.springframework.validation.BindingResult, Map)
     */
    @Test
    public void forgotPassword_shouldReturnErrorViewWhenThereIsAnUnexpectedError()
        throws Exception {
        given(spiService.forgetPassword(any(), any(), any()))
            .willThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(post(FORGOT_PASSWORD_WEB_ENDPOINT).with(csrf())
            .param(USER_EMAIL_PARAMETER, USER_EMAIL))
            .andExpect(status().isOk())
            .andExpect(view().name(ERROR_VIEW_NAME));
    }

    /**
     * @verifies put in model correct data and return forgot password view
     * @see AppController#resetForgotPassword(uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest)
     */
    @Test
    public void resetForgotPassword_shouldPutInModelCorrectDataAndReturnForgotPasswordView() throws Exception {
        mockMvc.perform(get(RESET_FORGOT_PASSWORD_ENDPOINT)
            .param(REDIRECTURI, REDIRECTURI)
            .param(USER_EMAIL_PARAMETER, USER_EMAIL))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(view().name(FORGOT_PASSWORD_VIEW));
    }


    /**
     * @verifies redirect to login view
     * @see AppController#logout(Map)
     */
    @Test
    public void logout_shouldRedirectToLoginView() throws Exception {
        mockMvc.perform(get(LOGOUT_ENDPOINT))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl(LOGIN_LOGOUT_VIEW));
    }

    /**
     * @verifies put in model correct data  then call authorize service and redirect using redirect url returned by service
     * @see AppController#authorize(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void authorize_shouldPutInModelCorrectDataThenCallAuthorizeServiceAndRedirectUsingRedirectUrlReturnedByService() throws Exception {

        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willReturn(REDIRECT_URI);

        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl(REDIRECT_URI));

        verify(spiService).authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID));
    }

    /**
     * @verifies put in model correct data if username or  password are empty.
     * @see AppController#authorize(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void authorize_shouldPutInModelCorrectDataIfUsernameOrPasswordAreEmpty() throws Exception {
        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, BLANK)
            .param(PASSWORD_PARAMETER, BLANK)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute("isUsernameEmpty", true))
            .andExpect(model().attribute("isPasswordEmpty", true))
            .andExpect(model().attribute("hasErrors", true))
            .andExpect(view().name(LOGIN_VIEW));
    }

    /**
     * @verifies put in model the correct data and return login view if authorize service doesn't return a response url
     * @see AppController#authorize(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void authorize_shouldPutInModelTheCorrectDataAndReturnLoginViewIfAuthorizeServiceDoesntReturnAResponseUrl() throws Exception {
        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willReturn(MISSING);

        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute(HAS_LOGIN_FAILED, true))
            .andExpect(view().name(LOGIN_VIEW));
    }

    /**
     * @verifies put in model the correct error detail in case authorize service throws a HttpClientErrorException and status code is 403 then return login view
     * @see AppController#authorize(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void authorize_shouldPutInModelTheCorrectErrorDetailInCaseAuthorizeServiceThrowsAHttpClientErrorExceptionAndStatusCodeIs403ThenReturnLoginView() throws Exception {
        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.name(), HAS_LOGIN_FAILED_RESPONSE.getBytes(), null));

        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(model().attribute(HAS_LOGIN_FAILED, true))
            .andExpect(status().isOk())

            .andExpect(view().name(LOGIN_VIEW));

        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.name(), ERR_LOCKED_FAILED_RESPONSE.getBytes(), null));


        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(model().attribute(IS_ACCOUNT_LOCKED, true))
            .andExpect(status().isOk())

            .andExpect(view().name(LOGIN_VIEW));

        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.name(), ERR_SUSPENDED_RESPONSE.getBytes(), null));


        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(model().attribute(IS_ACCOUNT_SUSPENDED, true))
            .andExpect(status().isOk())

            .andExpect(view().name(LOGIN_VIEW));

    }

    /**
     * @verifies put in model the correct error variable in case authorize service throws a HttpClientErrorException and status code is not 403 then return login view
     * @see AppController#authorize(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void authorize_shouldPutInModelTheCorrectErrorVariableInCaseAuthorizeServiceThrowsAHttpClientErrorExceptionAndStatusCodeIsNot403ThenReturnLoginView() throws Exception {
        given(spiService.authorize(eq(USER_EMAIL), eq(USER_PASSWORD), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        mockMvc.perform(post(AUTHORIZE_ENDPOINT).with(csrf())
            .param(USERNAME_PARAMETER, USER_EMAIL)
            .param(PASSWORD_PARAMETER, USER_PASSWORD)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(RESPONSE_TYPE_PARAMETER, RESPONSE_TYPE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute(HAS_LOGIN_FAILED, true))
            .andExpect(view().name(LOGIN_VIEW));

    }


    /**
     * @verifies put in model correct error data and return loginWithPin view if pin is missing.
     * @see AppController#loginWithPin(String, String, String, String, Map)
     */
    @Test
    public void loginWithPin_shouldPutInModelCorrectErrorDataAndReturnLoginWithPinViewIfPinIsMissing() throws Exception {

        mockMvc.perform(post(LOGIN_WITH_PIN_ENDPOINT).with(csrf())
            .param(PIN_PARAMETER, "")
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(view().name(LOGIN_WITH_PIN_VIEW));
    }

    /**
     * @verifies redirect to the url returned by service
     * @see AppController#loginWithPin(String, String, String, String, Map)
     */
    @Test
    public void loginWithPin_shouldRedirectToTheUrlReturnedByService() throws Exception {

        given(spiService.loginWithPin(eq(LOGIN_PIN_CODE), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willReturn(REDIRECTURI);

        mockMvc.perform(post(LOGIN_WITH_PIN_ENDPOINT).with(csrf())
            .param(PIN_PARAMETER, LOGIN_PIN_CODE)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl(REDIRECTURI));
    }

    /**
     * @verifies put in model the redirectUri parameter and error data and return loginWithPin view if service throws a HttpClientErrorException or BadCredentialException.
     * @see AppController#loginWithPin(String, String, String, String, Map)
     */
    @Test
    public void loginWithPin_shouldPutInModelTheRedirectUriParameterAndErrorDataAndReturnLoginWithPinViewIfServiceThrowsAHttpClientErrorExceptionOrBadCredentialException() throws Exception {
        given(spiService.loginWithPin(eq(LOGIN_PIN_CODE), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new HttpClientErrorException(HttpStatus.BAD_REQUEST));

        mockMvc.perform(post(LOGIN_WITH_PIN_ENDPOINT).with(csrf())
            .param(PIN_PARAMETER, LOGIN_PIN_CODE)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, VALID_SECURITY_CODE_ERROR))
            .andExpect(model().attribute(ERROR_MESSAGE, SECURITY_CODE_INCORRECT_ERROR))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(LOGIN_WITH_PIN_VIEW));

        given(spiService.loginWithPin(eq(LOGIN_PIN_CODE), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(new BadCredentialsException(BLANK));

        mockMvc.perform(post(LOGIN_WITH_PIN_ENDPOINT).with(csrf())
            .param(PIN_PARAMETER, LOGIN_PIN_CODE)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, VALID_SECURITY_CODE_ERROR))
            .andExpect(model().attribute(ERROR_MESSAGE, SECURITY_CODE_INCORRECT_ERROR))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(LOGIN_WITH_PIN_VIEW));

    }

    /**
     * @verifies put in model the correct error detail and return loginWithPin view if a generic exception occurs
     * @see AppController#loginWithPin(String, String, String, String, Map)
     */
    @Test
    public void loginWithPin_shouldPutInModelTheCorrectErrorDetailAndReturnLoginWithPinViewIfAGenericExceptionOccurs() throws Exception {
        given(spiService.loginWithPin(eq(LOGIN_PIN_CODE), eq(REDIRECT_URI), eq(STATE), eq(CLIENT_ID))).willThrow(Exception.class);

        mockMvc.perform(post(LOGIN_WITH_PIN_ENDPOINT).with(csrf())
            .param(PIN_PARAMETER, LOGIN_PIN_CODE)
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(STATE_PARAMETER, STATE)
            .param(CLIENT_ID_PARAMETER, CLIENT_ID))
            .andExpect(status().isOk())
            .andExpect(model().attribute(ERROR, ERROR))
            .andExpect(model().attribute(ERROR_TITLE, "public.login.with.pin.there.was.error"))
            .andExpect(model().attribute(ERROR_MESSAGE, "public.login.with.pin.try.action.again"))
            .andExpect(model().attribute(REDIRECTURI, REDIRECT_URI))
            .andExpect(view().name(LOGIN_WITH_PIN_VIEW));
    }

    /**
     * @verifies return forbidden if csrf token is invalid
     * @see AppController#login(uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest, BindingResult, org.springframework.ui.Model)
     */
    @Test
    public void login_shouldReturnForbiddenIfCsrfTokenIsInvalid() throws Exception {
        mockMvc.perform(post(LOGIN_ENDPOINT).with(csrf().useInvalidToken())
            .param(REDIRECT_URI, REDIRECT_URI)
            .param(CLIENT_ID_PARAMETER, MISSING))
            .andExpect(status().isForbidden());
    }

    /**
     * @verifies return tacticalActivateExpired
     * @see AppController#tacticalActivate()
     */
    @Test public void tacticalActivate_shouldReturnTacticalActivateExpired() throws Exception {
        mockMvc.perform(get(TACTICAL_ACTIVATE_ENDPOINT))
            .andExpect(view().name(TACTICAL_ACTIVATE_VIEW));
    }


}
