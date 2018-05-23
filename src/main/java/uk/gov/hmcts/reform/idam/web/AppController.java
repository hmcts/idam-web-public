package uk.gov.hmcts.reform.idam.web;

import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.CLIENTID;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EMAIL;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.ERRORPAGE_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.ERROR_MSG;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.ERROR_SUB_MSG;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EXPIREDTOKEN_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.INVALID_PIN;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.FORGOTPASSWORDSUCCESS_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.FORGOTPASSWORD_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.HAS_ERRORS;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.HAS_LOGIN_FAILED;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.IS_ACCOUNT_LOCKED;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.IS_ACCOUNT_SUSPENDED;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.LOGIN_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.LOGIN_WITH_PIN_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.PASSWORD;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.REDIRECTURI;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.REGISTER_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.RESETPASSWORD_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.RESPONSE_TYPE;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.STATE;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.UPLIFT_USER_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.USERCREATED_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.USERNAME;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import uk.gov.hmcts.reform.idam.api.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.api.model.User;
import uk.gov.hmcts.reform.idam.web.helper.ErrorHelper;
import uk.gov.hmcts.reform.idam.web.helper.MvcKeys;
import uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest;
import uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest;
import uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest;
import uk.gov.hmcts.reform.idam.web.model.UpliftRequest;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;
import uk.gov.hmcts.reform.idam.web.strategic.ValidationService;

@Slf4j
@Controller
public class AppController {


    @Autowired
    private SPIService service;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private ObjectMapper objectMapper;


    /**
     * @should return index view
     */
    @RequestMapping("/")
    public String index(final Map<String, Object> model) {

        return MvcKeys.INDEX_VIEW;
    }

    /**
     * @should put correct data in model and return login view
     * @should return error page view if OAuth2 details are missing
     */
    @RequestMapping("/login")
    public String login(@ModelAttribute("authorizeCommand") AuthorizeRequest request,
                        BindingResult bindingResult, Model model) {
        if (StringUtils.isEmpty(request.getClient_id()) || StringUtils.isEmpty(request.getRedirect_uri())) {
            model.addAttribute(ERROR_MSG, "error.page.access.denied");
            model.addAttribute(ERROR_SUB_MSG, "public.error.page.access.denied.text");
            return ERRORPAGE_VIEW;
        }
        model.addAttribute(RESPONSE_TYPE, request.getResponse_type());
        model.addAttribute(STATE, request.getState());
        model.addAttribute(CLIENT_ID, request.getClient_id());
        model.addAttribute(REDIRECT_URI, request.getRedirect_uri());
        return LOGIN_VIEW;
    }

    /**
     * @should return expired token view
     */
    @RequestMapping("/expiredtoken")
    public String expiredtoken(final Map<String, Object> model) {

        return EXPIREDTOKEN_VIEW;
    }

    /**
     * @should return login with pin view
     */
    @RequestMapping("/login/pin")
    public String loginWithPin(final Map<String, Object> model) {

        return LOGIN_WITH_PIN_VIEW;
    }

    /**
     * @should return user uplift page if the user is authorized
     * @should return error page if the user is not authorized
     */
    @RequestMapping("/login/uplift")
    public String uplift(
        @RequestParam(value = "jwt") String jwt,
        @ModelAttribute("registerUserCommand") RegisterUserRequest request,
        final Map<String, Object> model) {

        if (!checkUserAuthorised(jwt, model)) {
            return ERRORPAGE_VIEW;
        }

        return UPLIFT_USER_VIEW;
    }

    /**
     * @should return user registration page if the user is authorized
     * @should return error page if the user is not authorized
     */
    @RequestMapping("/register")
    public String selfRegister(@RequestParam(value = "jwt") String jwt, final Map<String, Object> model) {

        if (!checkUserAuthorised(jwt, model)) {
            return ERRORPAGE_VIEW;
        }

        return REGISTER_VIEW;
    }

    /**
     * @should put right error data in model if mandatory fields are missing and return upliftUser view
     * @should return upliftUser view if register user service returns http code different from 201
     * @should put email in model and return usercreated view if register user service returns http code 201
     * @should put right error data in model if register user service throws HttpClientErrorException with 404 http status code
     * @should put generic error data in model if register user service throws HttpClientErrorException an http status code different from 404
     * @should reject request if the username is invalid
     * @should reject request if the first name is missing
     * @should reject request if the last name is missing
     * @should reject request if the jwt is missing
     * @should reject request if the redirect URI is missing
     * @should reject request if the clientId is missing
     */
    @RequestMapping("/registerUser")
    public String registerUser(@ModelAttribute("registerUserCommand") @Validated RegisterUserRequest request, BindingResult bindingResult, final Map<String, Object> model, RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            ErrorHelper.showLoginError("Information is missing or invalid",
                "Please fix the following",
                request.getRedirectUri(),
                model);
            return UPLIFT_USER_VIEW;
        }

        try {
            ResponseEntity<String> resetPasswordEntity = service.registerUser(request.getFirstName(), request.getLastName(), request.getUsername(), request.getJwt(), request.getRedirectUri(), request.getClientId());
            if (resetPasswordEntity.getStatusCode() == HttpStatus.CREATED) {
                model.put(EMAIL, request.getUsername());
                model.put(REDIRECTURI, request.getRedirectUri());
                model.put(CLIENTID, request.getClientId());
                return USERCREATED_VIEW;
            } else {
                return UPLIFT_USER_VIEW;
            }
        } catch (HttpClientErrorException ex) {
            String msg = "";
            if (ex.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                msg = "PIN user not longer valid";
            }

            ErrorHelper.showLoginError("Sorry, there was an error",
                String.format("Please try your action again. %s", msg),
                request.getRedirectUri(),
                model);

            return UPLIFT_USER_VIEW;
        }
    }

    /**
     * @should redirect to login view
     */
    @RequestMapping("/logout")
    public String logout(final Map<String, Object> model) {

        return LOGIN_VIEW;
    }

    /**
     * @should redirect to reset password page if token is valid
     * @should redirect to token expired page if token is invalid
     */
    @RequestMapping("/passwordReset")
    public String passwordReset(@RequestParam("action") String action, @RequestParam("token") String token, @RequestParam("code") String code) {
        String nextPage = RESETPASSWORD_VIEW;
        try {
            service.validateResetPasswordToken(token, code);
        } catch (Exception e) {
            nextPage = EXPIREDTOKEN_VIEW;
        }
        return nextPage;
    }


    /**
     * @should put in model correct data and return forgot password view
     */
    @RequestMapping("/reset/forgotpassword")
    public String resetForgotPassword(@ModelAttribute("forgotPasswordCommand") ForgotPasswordRequest forgotPasswordRequest) {

        return FORGOTPASSWORD_VIEW;
    }

    /**
     * @should put in model correct data  then call authorize service and redirect using redirect url returned by service
     * @should put in model correct data if username or  password are empty.
     * @should put in model the correct data and return login view if authorize service doesn't return a response url
     * @should put in model the correct error detail in case authorize service throws a HttpClientErrorException and status code is 403 then return login view
     * @should put in model the correct error variable in case authorize service throws a HttpClientErrorException and status code is not 403 then return login view
     */
    @RequestMapping(method = RequestMethod.POST, path = "/authorize")
    public String authorize(@ModelAttribute("authorizeCommand") @Validated AuthorizeRequest request,
                            BindingResult bindingResult, Model model) {
        String nextPage = LOGIN_VIEW;
        model.addAttribute(USERNAME, request.getUsername());
        model.addAttribute(PASSWORD, request.getPassword());
        model.addAttribute(RESPONSE_TYPE, request.getResponse_type());
        model.addAttribute(STATE, request.getState());
        model.addAttribute(CLIENT_ID, request.getClient_id());
        model.addAttribute(REDIRECT_URI, request.getRedirect_uri());
        try {
            if (bindingResult.hasErrors()) {
                if (StringUtils.isEmpty(request.getUsername())) {
                    model.addAttribute("isUsernameEmpty", true);
                }
                if (StringUtils.isEmpty(request.getPassword())) {
                    model.addAttribute("isPasswordEmpty", true);
                }
                model.addAttribute(HAS_ERRORS, true);
            } else {
                String responseUrl = service.authorize(request.getUsername(), request.getPassword(), request.getRedirect_uri(), request.getState(), request.getClient_id());
                if (responseUrl != null) {
                    nextPage = "redirect:" + responseUrl;
                } else {
                    log.info("There is a problem while login in  user - " + request.getUsername());
                    model.addAttribute(HAS_LOGIN_FAILED, true);
                    bindingResult.reject("Login failure");
                }
            }
        } catch (HttpClientErrorException | HttpServerErrorException he) {
            log.info("Login failed for user - " + request.getUsername());
            if (HttpStatus.FORBIDDEN == he.getStatusCode()) {

                getLoginFailureReason(he, model, bindingResult);

            } else {

                model.addAttribute(HAS_LOGIN_FAILED, true);
                bindingResult.reject("Login failure");
            }
        }
        return nextPage;
    }

    private void getLoginFailureReason(HttpStatusCodeException hex, Model model, BindingResult bindingResult) {

        try {
            ErrorResponse error = objectMapper.readValue(hex.getResponseBodyAsString(), ErrorResponse.class);
            if (ErrorResponse.CodeEnum.ACCOUNT_LOCKED.equals(error.getCode())) {
                model.addAttribute(IS_ACCOUNT_LOCKED, true);
                bindingResult.reject("Account locked");
            } else if (ErrorResponse.CodeEnum.ACCOUNT_SUSPENDED.equals(error.getCode())) {
                model.addAttribute(IS_ACCOUNT_SUSPENDED, true);
                bindingResult.reject("Account suspended");
            } else {
                model.addAttribute(HAS_LOGIN_FAILED, true);
                bindingResult.reject("Login failure");
            }
        } catch (IOException e) {
            log.error("Authentication error : {}", hex.getResponseBodyAsString(), hex);
            throw new BadCredentialsException("Exception occurred during authentication", hex);
        }
    }

    /**
     * @should uplift user
     * @should reject request if username is not provided
     * @should reject request if username is invalid
     * @should reject request if password is not provided
     * @should reject request if JWT is not provided
     * @should reject request if redirectUri is not provided
     * @should reject request if clientId is not provided
     * @should return to the registration page if the credentials are invalid
     * @should return to the registration page if there is an exception
     */
    @RequestMapping("/uplift")
    public ModelAndView uplift(@Validated UpliftRequest request, final Map<String, Object> model, ModelMap modelMap) {
        String redirectUrl = "redirect:";
        try {
            final String jsonResponse = service.uplift(request.getUsername(), request.getPassword(), request.getJwt(),
                request.getRedirectUri(), request.getClientId(), request.getState());
            if (jsonResponse != null) {
                redirectUrl += jsonResponse;
            }
        } catch (HttpClientErrorException ex) {
            log.error("Uplift process exception: {}", ex.getMessage(), ex);

            ErrorHelper.showLoginError("Incorrect email/password combination",
                "Please check your email address and password and try again",
                request.getRedirectUri(),
                model);
            return new ModelAndView(REGISTER_VIEW, modelMap);

        } catch (Exception ex) {
            log.error("Uplift process exception: {}", ex.getMessage());

            ErrorHelper.showLoginError("Sorry, there was an error",
                "Please try your action again.",
                request.getRedirectUri(),
                model);
            return new ModelAndView(REGISTER_VIEW, modelMap);
        }
        return new ModelAndView(redirectUrl, modelMap);
    }

    /**
     * @should put in model correct error data and return loginWithPin view if pin is missing.
     * @should redirect to the url returned by service
     * @should put in model the redirectUri parameter and error data and return loginWithPin view if service throws a HttpClientErrorException or BadCredentialsException.
     * @should put in model the correct error detail and return loginWithPin view if a generic exception occurs
     */
    @PostMapping("/loginWithPin")
    public String loginWithPin(@RequestParam(value = "pin", required = false) String pin,
                               @RequestParam(value = "redirect_uri") String redirectUri,
                               @RequestParam(value = "state", required = false) String state,
                               @RequestParam(value = "client_id") String clientId,
                               Map<String, Object> model) {

        //Quick null check to avoid calling backend
        if (StringUtils.isBlank(pin)) {
            ErrorHelper.showLoginError("public.login.with.pin.valid.security.code.error", "public.login.with.pin.security.code.incorrect.error", redirectUri, model);
            return LOGIN_WITH_PIN_VIEW;
        }

        try {

            return "redirect:" + service.loginWithPin(pin, redirectUri, state, clientId);

        } catch (HttpClientErrorException | BadCredentialsException e) {
            log.error("Problem with pin: {}", e.getMessage());

            ErrorHelper.showLoginError("public.login.with.pin.valid.security.code.error", "public.login.with.pin.security.code.incorrect.error", redirectUri, model);
            model.put(INVALID_PIN, true);
            model.put(REDIRECTURI, redirectUri);

            return LOGIN_WITH_PIN_VIEW;
        } catch (Exception ex) {
            log.error("PIN login exception: {}", ex.getMessage());

            ErrorHelper.showLoginError("public.login.with.pin.there.was.error",
                "public.login.with.pin.try.action.again",
                redirectUri,
                model);
            return LOGIN_WITH_PIN_VIEW;
        }

    }

    /**
     * @should call forget password with the right parameters
     * @should not call forget password if there are validation errors
     * @should return forgot password success view when there are no errors
     * @should return forgot password view with correct model data when there are validation errors
     * @should return error view when there is an unexpected error
     */
    @PostMapping(value = "/reset/doForgotPassword")
    public String forgotPassword(@ModelAttribute("forgotPasswordCommand") @Validated ForgotPasswordRequest forgotPasswordRequest,
                                 final BindingResult bindingResult,
                                 final Map<String, Object> model) {
        model.put(REDIRECTURI, forgotPasswordRequest.getRedirectUri());
        model.put(CLIENTID, forgotPasswordRequest.getClientId());
        model.put(EMAIL, forgotPasswordRequest.getEmail());

        try {
            if (!bindingResult.hasErrors()) {
                service.forgetPassword(
                    forgotPasswordRequest.getEmail(),
                    forgotPasswordRequest.getRedirectUri(),
                    forgotPasswordRequest.getClientId());
                return FORGOTPASSWORDSUCCESS_VIEW;
            }
        } catch (Exception e) {
            return ERRORPAGE_VIEW;
        }
        return FORGOTPASSWORD_VIEW;
    }


    /**
     * @should put in model redirect uri if service returns http 200 and redirect uri is present in response then return reset password success view
     * @should put in model the correct error code if HttpClientErrorException with http 412 is thrown by service then return reset password view.
     * @should put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password is blacklisted then return reset password view.
     * @should put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password is previously used then return reset password view.
     * @should redirect to expired token if HttpClientErrorException with http 404 is thrown by service.
     * @should return reset password view if request validation fails.
     */
    @PostMapping(value = "/doResetPassword")
    public String resetPassword(final String action, final String password1, final String password2, final String token, final String code, final Map<String, Object> model) throws IOException {
        try {
            if (validationService.validateResetPasswordRequest(password1, password2, model)) {
                ResponseEntity<String> resetPasswordEntity = service.resetPassword(password1, token, code);

                if (resetPasswordEntity.getStatusCode() == HttpStatus.OK) {
                    String redirectUri = getRedirectUri(resetPasswordEntity.getBody());
                    if (redirectUri != null) {
                        model.put(REDIRECTURI, redirectUri);
                    }

                    return "resetpasswordsuccess";
                }
            }

        } catch (HttpClientErrorException e) {
            log.error("Error resetting password: {}", e.getResponseBodyAsString(), e);
            if (e.getStatusCode() == HttpStatus.PRECONDITION_FAILED) {
                ErrorHelper.showError("Error", "public.common.error.invalid.password", "public.common.error.password.details", "", model);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED)) {
                    ErrorHelper.showError("Error", "public.common.error.blacklisted.password", "public.common.error.password.details", "public.common.error.enter.password", model);
                } else if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.ACCOUNT_LOCKED)) {
                    ErrorHelper.showError("Error", "public.common.error.previously.used.password", "public.common.error.password.details", "public.common.error.enter.password", model);
                }
            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return "redirect:expiredtoken";
            }
        }
        return RESETPASSWORD_VIEW;
    }

    private String getRedirectUri(String json) throws IOException {

        ObjectNode object = new ObjectMapper().readValue(json, ObjectNode.class);
        JsonNode node = object.get(REDIRECTURI);

        if (node != null) {
            return node.textValue();
        } else {
            return null;
        }
    }

    public boolean checkUserAuthorised(String jwt, Map<String, Object> model) {
        Optional<User> user = service.getDetails(jwt);

        if (!user.isPresent() || Objects.isNull(user.get().getRoles()) || !user.get().getRoles().contains("letter-holder")) {
            model.put(ERROR_MSG, "error.page.not.authorized");
            model.put(ERROR_SUB_MSG, "public.error.page.please.contact.admin");
            return false;
        }

        return true;
    }

}