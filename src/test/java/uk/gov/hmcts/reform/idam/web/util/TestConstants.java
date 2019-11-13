package uk.gov.hmcts.reform.idam.web.util;

public class TestConstants {


    //codes
    public static final String USER_ACTIVATION_TOKEN = "eyJ0eXAiOiJKV1QiLCJjdHkiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
    public static final String USER_ACTIVATION_CODE = "7bd1a1a6-a2ec-41d6-aca4-8a2effce6a8f";
    public static final String JWT = "aaa.bbbbbbbbbbb.ccc";
    public static final String RESET_PASSWORD_TOKEN = "eyJ0eXAiOiJKV1QiLCJjdHkiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
    public static final String RESET_PASSWORD_CODE = "7bd1a1a6-a2ec-41d6-aca4-8a2effce6a8f";
    public static final String AUTHORIZATION_TOKEN = "626df426ab324782b0f969b3302adb04626df426ab324782b0f969b3302adb04";
    public static final String LOGIN_PIN_CODE = "e2c0afac-fd92-4e9a-b1e9-03944384a083";


    //endpoints
    public static final String USERS_ENDPOINT = "/users";
    public static final String SELF_REGISTER_ENDPOINT = "/users/selfRegister";
    public static final String VALIDATE_TOKEN_ENDPOINT = "/users/register";
    public static final String VALIDATE_TOKEN_API_ENDPOINT = "/validate";
    public static final String USERS_SELF_ENDPOINT = "users/self";
    public static final String UPLIFT_REGISTER_ENDPOINT = "/login/uplift";
    public static final String RESET_PASSWORD_ENDPOINT = "resetPassword";
    public static final String FORGOT_PASSWORD_SPI_ENDPOINT = "forgotPassword";
    public static final String FORGOT_PASSWORD_WEB_ENDPOINT = "/reset/doForgotPassword";
    public static final String PASSWORD_RESET_ENDPOINT = "/passwordReset";
    public static final String DO_RESET_PASSWORD_ENDPOINT = "/doResetPassword";
    public static final String UPLIFT_LOGIN_ENDPOINT = "/register";
    public static final String API_LOGIN_UPLIFT_ENDPOINT = "/login/uplift";
    public static final String ACTIVATE_USER_ENDPOINT = "/users/activate";
    public static final String LOGIN_ENDPOINT = "/login";
    public static final String VERIFICATION_ENDPOINT = "/verification";
    public static final String EXPIRED_TOKEN_ENDPOINT = "/expiredtoken";
    public static final String LOGIN_PIN_ENDPOINT = "/login/pin";
    public static final String LOGOUT_ENDPOINT = "/logout";
    public static final String RESET_FORGOT_PASSWORD_ENDPOINT = "/reset/forgotpassword";
    public static final String LOGIN_WITH_PIN_ENDPOINT = "/loginWithPin";
    public static final String ACTIVATE_ENDPOINT = "/activate";
    public static final String OAUTH2_AUTHORIZE_ENDPOINT = "oauth2/authorize";
    public static final String AUTHENTICATE_ENDPOINT = "authenticate";
    public static final String VALIDATE_RESET_PASSWORD_ENDPOINT = "validateResetPasswordToken";
    public static final String SELF_REGISTRATION_ENDPOINT = "users/selfregister";
    public static final String DETAILS_ENDPOINT = "details";
    public static final String SERVICES_ENDPOINT = "services";
    public static final String TACTICAL_ACTIVATE_ENDPOINT = "/activate";
    public static final String TACTICAL_RESET_ENDPOINT = "/reset";
    public static final String HEALTH_ENDPOINT = "health";

    //uris
    public static final String GOOGLE_WEB_ADDRESS = "https://www.google.com";
    public static final String REDIRECT_URI = "redirect_uri";
    public static final String FORM_DATA = "form_data";
    public static final String SERVICE_OAUTH2_REDIRECT_URI = "https://cmc.reform.hmcts.net/start";
    public static final String API_URL = "http://api.reform.hmcts.net";
    public static final String SELF_REGISTRATION_URL = String.format("%s/%s?jwt=%s", API_URL, USERS_SELF_ENDPOINT, JWT);
    public static final String RESET_PASSWORD_URI = String.format("%s/%s", API_URL, RESET_PASSWORD_ENDPOINT);
    public static final String FORGOT_PASSWORD_URI = String.format("%s/%s", API_URL, FORGOT_PASSWORD_SPI_ENDPOINT);


    //Views
    public static final String USERS_VIEW_NAME = "users";
    public static final String SELF_REGISTER_VIEW_NAME = "selfRegister";
    public static final String EXPIRED_PASSWORD_RESET_TOKEN_VIEW_NAME = "expiredPasswordResetLink";
    public static final String EXPIRED_ACTIVATION_TOKEN_VIEW_NAME = "expiredActivationLink";
    public static final String USER_ACTIVATION_VIEW_NAME = "useractivation";
    public static final String USER_ACTIVATED_VIEW_NAME = "useractivated";
    public static final String ERROR_VIEW_NAME = "errorpage";
    public static final String USER_CREATED_VIEW_NAME = "usercreated";
    public static final String RESETPASSWORD_VIEW_NAME = "resetpassword";
    public static final String EXPIREDTOKEN_VIEW_NAME = "expiredtoken";
    public static final String FORGOT_PASSWORD_VIEW = "forgotpassword";
    public static final String FORGOT_PASSWORD_SUCCESS_VIEW = "forgotpasswordsuccess";
    public static final String RESET_PASSWORD_SUCCESS_VIEW = "resetpasswordsuccess";
    public static final String INDEX_VIEW = "index";
    public static final String LOGIN_VIEW = "login";
    public static final String LOGIN_WITH_PIN_VIEW = "loginWithPin";
    public static final String LOGIN_LOGOUT_VIEW = "/login?logout";
    public static final String NOT_FOUND_VIEW = "404";
    public static final String TACTICAL_ACTIVATE_VIEW = "tacticalActivateExpired";


    //User
    public static final String USER_EMAIL = "jimmy.gregory@gmail.com";
    public static final String USER_EMAIL_INVALID = "jimmy.gregory+gmail.com";
    public static final String USER_FIRST_NAME = "Jimmy";
    public static final String USER_LAST_NAME = "GREGORY";
    public static final String USER_PASSWORD = "Passw0rd";
    public static final String USER_IP_ADDRESS = "192.168.0.1";
    public static final String LONG_PASSWORD = "Looooooooooooooooooooooooodp49v83tun29340bt89vgnj0cucvh5b0t78yvn078fu4nb087vhn0834ynb0v75yb0nv785yngb0745n0v45yb784yntv307450bty74n0dp49v83tun29340bt89vgnj0cucvh5b0t78yvn078fu4nb087vhn0834ynb0v75yb0nv785yngb0745n0v45yb784yntv307450bty74n0dp49v83tun29340bt89vgnj0cucvh5b0t78yvn078fu4nb087vhn0834ynb0v75yb0nv785yngb0745n0v45yb784yntv307450bty74n0ng";
    public static final String SHORT_PASSWORD = "Short";
    public static final String PASSWORD_ONE = "password1";
    public static final String PASSWORD_TWO = "password2";
    public static final String USER_NAME = "userName";
    public static final String BASE64_ENC_FORM_DATA = "ewogICJmaXJzdE5hbWUiOiAiSm9obiIsCiAgImxhc3ROYW1lIjogIkRvZSIsCiAgImVtYWlsIjogImpvaG4uZG9lQGVtYWlsLmNvbSIKfQ==";


    //Service
    public static final String SERVICE_LABEL = "label";
    public static final String SERVICE_CLIENT_ID = "client_id";


    //Parameters
    public static final String IDAM_SESSION_COOKIE_NAME = "Idam.Session";
    public static final String ACTION_PARAMETER = "action";
    public static final String TOKEN_PARAMETER = "token";
    public static final String CODE_PARAMETER = "code";
    public static final String USER_FIRST_NAME_PARAMETER = "firstName";
    public static final String USER_LAST_NAME_PARAMETER = "lastName";
    public static final String USER_EMAIL_PARAMETER = "email";
    public static final String JWT_PARAMETER = "jwt";
    public static final String STATE_PARAMETER = "state";
    public static final String SCOPE_PARAMETER = "scope";
    public static final String CLIENT_ID_PARAMETER = "client_id";
    public static final String CLIENTID_PARAMETER = "clientId";
    public static final String USERNAME_PARAMETER = "username";
    public static final String PASSWORD_PARAMETER = "password";
    public static final String RESPONSE_TYPE_PARAMETER = "response_type";
    public static final String PIN_PARAMETER = "pin";
    public static final String AUTHORIZATION_PARAMETER = "authorization";
	public static final String SELF_REGISTRATION_ENABLED = "selfRegistrationEnabled";


    //Errors
    public static final String INFORMATION_IS_MISSING_OR_INVALID = "Information is missing or invalid";
    public static final String PLEASE_FIX_THE_FOLLOWING = "Please fix the following";
    public static final String SORRY_THERE_WAS_AN_ERROR = "Sorry, there was an error";
    public static final String PIN_USER_NOT_LONGER_VALID = "PIN user not longer valid";
    public static final String PLEASE_TRY_AGAIN = "Please try your action again. ";
    public static final String ERROR_MSG = "errorMsg";
    public static final String GENERIC_ERROR_KEY = "public.error.page.generic.error";
    public static final String ALREADY_ACTIVATED_KEY = "public.error.page.already.activated.description";
    public static final String ERROR_BLACKLISTED_PASSWORD = "public.common.error.blacklisted.password";
    public static final String ERROR_CONTAINS_PERSONAL_INFO_PASSWORD = "public.common.error.containspersonalinfo.password";
    public static final String ERROR_INVALID_PASSWORD = "public.common.error.invalid.password";
    public static final String ERROR_PREVIOUSLY_USED_PASSWORD = "public.common.error.previously.used.password";
    public static final String ERROR = "error";
    public static final String ERROR_TITLE = "errorTitle";
    public static final String ERROR_MESSAGE = "errorMessage";
    public static final String ERROR_LABEL_ONE = "errorLabelOne";
    public static final String ERROR_LABEL_TWO = "errorLabelTwo";
    public static final String ERROR_CAPITAL = "Error";
    public static final String ERROR_PASSWORD_DETAILS = "public.common.error.password.details";
    public static final String ERROR_ENTER_PASSWORD = "public.common.error.enter.password";
    public static final String HAS_LOGIN_FAILED = "hasLoginFailed";
    public static final String IS_ACCOUNT_LOCKED = "isAccountLocked";
    public static final String IS_ACCOUNT_SUSPENDED = "isAccountSuspended";
    public static final String VALID_SECURITY_CODE_ERROR = "public.login.with.pin.valid.security.code.error";
    public static final String SECURITY_CODE_INCORRECT_ERROR = "public.login.with.pin.security.code.incorrect.error";
    public static final String ERROR_PASSWORD_NOT_EMPTY = "public.common.error.password.not.empty";


    //Commands
    public static final String SELF_REGISTER_COMMAND = "selfRegisterCommand";
    public static final String FORGOT_PASSWORD_COMMAND_NAME = "forgotPasswordCommand";


    //Generic
    public static final String MISSING = null;
    public static final String BLANK = "";
    public static final String SLASH = "/";
    public static final String UNUSED = "unused";
    public static final String SERVICE_OAUTH2_CLIENT_ID = "cmc-citizen";
    public static final String RESPONSE_TYPE = "response type";
    public static final String STATE = "state test";
    public static final String CLIENT_ID = "clientId";
    public static final String REDIRECTURI = "redirectUri";
    public static final String CUSTOM_SCOPE = "manage-roles";
    public static final String INSECURE_SESSION_COOKE = IDAM_SESSION_COOKIE_NAME + "=A_TASTY_TREAT";
    public static final String AUTHENTICATE_SESSION_COOKE = IDAM_SESSION_COOKIE_NAME + "=A_TASTY_TREAT; Path=/; Secure; HttpOnly";

    //Responses
    public static final String PASSWORD_BLACKLISTED_RESPONSE = "{\"code\":\"PASSWORD_BLACKLISTED\"}";
    public static final String PASSWORD_CONTAINS_PERSONAL_INFO = "{\"code\":\"PASSWORD_CONTAINS_PERSONAL_INFO\"}";
    public static final String TOKEN_INVALID_RESPONSE = "{\"code\":\"TOKEN_INVALID\"}";
    public static final String RESET_PASSWORD_RESPONSE = "{\"" + REDIRECTURI + "\":\"" + REDIRECTURI + "\"}";
    public static final String HAS_LOGIN_FAILED_RESPONSE = "{\"code\":\"HAS_LOGIN_FAILED\"}";
    public static final String ERR_LOCKED_FAILED_RESPONSE = "{\"code\":\"ACCOUNT_LOCKED\"}";
    public static final String ERR_SUSPENDED_RESPONSE = "{\"code\":\"ACCOUNT_SUSPENDED\"}";
    public static final String SELF_REGISTRATION_RESPONSE = "{\"firstName\":\"" + USER_FIRST_NAME + "\",\"lastName\":\"" + USER_LAST_NAME + "\",\"email\":\"" + USER_EMAIL + "\",\"redirectUri\":\"" + REDIRECT_URI + "\",\"clientId\":\"clientId\",\"state\":\"" + STATE + "\"}";


    //Requests
    public static final String ACTIVATE_USER_REQUEST = "{\"token\":\"" + USER_ACTIVATION_TOKEN + "\",\"code\":\"" + USER_ACTIVATION_CODE + "\",\"password\":\"" + PASSWORD_ONE + "\"}";


}
