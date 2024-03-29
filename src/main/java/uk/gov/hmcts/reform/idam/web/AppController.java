package uk.gov.hmcts.reform.idam.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.api.internal.model.Service;
import uk.gov.hmcts.reform.idam.api.shared.model.User;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.helper.AuthHelper;
import uk.gov.hmcts.reform.idam.web.helper.ErrorHelper;
import uk.gov.hmcts.reform.idam.web.model.AuthorizeRequest;
import uk.gov.hmcts.reform.idam.web.model.ForgotPasswordRequest;
import uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest;
import uk.gov.hmcts.reform.idam.web.model.UpliftRequest;
import uk.gov.hmcts.reform.idam.web.model.VerificationRequest;
import uk.gov.hmcts.reform.idam.web.sso.SSOService;
import uk.gov.hmcts.reform.idam.web.strategic.ApiAuthResult;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;
import uk.gov.hmcts.reform.idam.web.strategic.ValidationService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static com.netflix.zuul.constants.ZuulHeaders.X_FORWARDED_FOR;
import static java.util.Optional.ofNullable;
import static uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse.CodeEnum.STALE_USER_REGISTRATION_SENT;
import static uk.gov.hmcts.reform.idam.web.UserController.GENERIC_ERROR_KEY;
import static uk.gov.hmcts.reform.idam.web.UserController.GENERIC_SUB_ERROR_KEY;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.*;
import static uk.gov.hmcts.reform.idam.web.sso.SSOService.SSO_IDAM_API_PROVIDER_MAP;
import static uk.gov.hmcts.reform.idam.web.sso.SSOService.SSO_LOGIN_HINTS;

@Slf4j
@Controller
public class AppController {

    private static final String REDIRECT_RESET_INACTIVE_USER = "redirect:/reset/inactive-user";
    private static final String REDIRECT_OIDC_AUTHORIZE = "redirect:/o/authorize";
    public static final String LOGIN_FAILURE_ERROR_CODE = "Login failure";
    public static final String REDIRECT_PREFIX = "redirect:";
    public static final String REDIRECT_PREFIX_WITH_SLASH = "redirect:/";
    public static final String AUTHORIZE_COMMAND = "authorizeCommand";
    public static final String IDAM_AUTH_ID_COOKIE_PREFIX = "Idam.AuthId=";

    private final SPIService spiService;

    private final ValidationService validationService;

    private final ObjectMapper objectMapper;

    private final ConfigurationProperties configurationProperties;

    private final ObjectMapper mapper;

    private final SSOService ssoService;

    private final AuthHelper authHelper;

    @Value("${features.sso-auto-login-redirect:true}")
    private Boolean ssoAutoRedirect;

    public AppController(SPIService spiService,
                         ValidationService validationService,
                         ObjectMapper objectMapper,
                         ConfigurationProperties configurationProperties,
                         ObjectMapper mapper,
                         SSOService ssoService,
                         AuthHelper authHelper) {
        this.spiService = spiService;
        this.validationService = validationService;
        this.objectMapper = objectMapper;
        this.configurationProperties = configurationProperties;
        this.mapper = mapper;
        this.ssoService = ssoService;
        this.authHelper = authHelper;
    }

    /**
     * @should return index view
     */
    @GetMapping("/")
    public String indexView(RedirectAttributes redirectAttributes,
                            HttpServletRequest request,
                            final Map<String, Object> model) {
        redirectAttributes.addAllAttributes(request.getParameterMap());
        return REDIRECT_PREFIX + LOGIN_VIEW;
    }

    /**
     * @should return expired token view
     */
    @GetMapping("/expiredtoken")
    public String expiredTokenView(final Map<String, Object> model) {

        return EXPIRED_PASSWORD_RESET_LINK_VIEW;
    }

    /**
     * @should return login with pin view
     */
    @GetMapping("/login/pin")
    public String loginWithPinView(final Map<String, Object> model) {

        return LOGIN_WITH_PIN_VIEW;
    }

    /**
     * @should return user uplift page if the user is authorized
     * @should return error page if the user is not authorized
     */
    @GetMapping("/login/uplift")
    public String upliftRegisterView(@RequestParam("client_id") String clientId,
                                     @RequestParam("redirect_uri") String redirectUri,
                                     @RequestParam String jwt,
                                     @ModelAttribute("registerUserCommand") RegisterUserRequest request,
                                     final Map<String, Object> model) {

        if (!checkUserAuthorised(jwt, model)) {
            return ERRORPAGE_VIEW;
        }

        return UPLIFT_REGISTER_VIEW;
    }

    /**
     * @should return user registration page if the user is authorized
     * @should return error page if the user is not authorized
     */
    @GetMapping("/register")
    public String upliftLoginView(@RequestParam String jwt,
                                  @RequestParam(value = "client_id") String clientId,
                                  @RequestParam(value = "redirect_uri") String redirectUri,
                                  final Map<String, Object> model) {

        if (!checkUserAuthorised(jwt, model)) {
            return PAGE_NOT_FOUND_VIEW;
        }

        return UPLIFT_LOGIN_VIEW;
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
     * @should reject request if the client_id is missing
     */
    @PostMapping("/login/uplift")
    public ModelAndView upliftRegister(@ModelAttribute("registerUserCommand") @Validated RegisterUserRequest request,
                                       BindingResult bindingResult,
                                       final Map<String, Object> model) {

        if (bindingResult.hasErrors()) {
            ErrorHelper.showLoginError("There is a problem",
                "Please fix the following",
                request.getRedirect_uri(),
                model);
            return new ModelAndView(UPLIFT_REGISTER_VIEW, model);
        }

        try {
            spiService.registerUser(request);
        } catch (HttpClientErrorException ex) {
            String msg = "";

            if (ex.getStatusCode().equals(HttpStatus.NOT_FOUND)) {

                if (StringUtils.isNotBlank(ex.getResponseBodyAsString())
                    && ex.getResponseBodyAsString().contains(STALE_USER_REGISTRATION_SENT.toString())) {
                    model.remove("registerUserCommand");
                    model.put(CLIENT_ID, request.getClient_id());
                    model.put(REDIRECT_URI, request.getRedirect_uri());
                    model.put(STATE, request.getState());
                    model.put(NONCE, request.getNonce());
                    return new ModelAndView(REDIRECT_RESET_INACTIVE_USER, model);
                }

                msg = "PIN user no longer valid";
            }

            if (!ex.getStatusCode().equals(HttpStatus.CONFLICT)) {
                ErrorHelper.showLoginError("Sorry, there was an error",
                    String.format("Please try your action again. %s", msg),
                    request.getRedirect_uri(),
                    model);
                // We use spring:hasBindErrors so make sure the 'showLoginError' is rendered to the page
                // by adding a binding error
                bindingResult.reject("non-existent-error-code");

                return new ModelAndView(UPLIFT_REGISTER_VIEW, model);
            }
        }

        model.put(EMAIL, request.getUsername());
        model.put(REDIRECTURI, request.getRedirect_uri());
        model.put(CLIENT_ID, request.getClient_id());
        model.put(JWT, request.getJwt());
        model.put(STATE, request.getState());
        model.put(NONCE, request.getNonce());

        return new ModelAndView(USERCREATED_VIEW, model);
    }

    /**
     * @should redirect to logout view
     */
    @GetMapping("/logout")
    public RedirectView logout(final Map<String, Object> model) {
        return new RedirectView("/" + LOGIN_VIEW + "?logout");
    }

    /**
     * @should redirect to passwordReset view
     */
    @GetMapping(value = "/passwordReset")
    public String getPasswordReset(@RequestParam("token") String token, @RequestParam("code") String code, Model model) {
        return this.passwordReset(token, code, model);
    }

    /**
     * @should redirect to reset password page if token is valid
     * @should redirect to token expired page if token is invalid
     * @should redirect to token expired page if token is expired
     */
    @PostMapping(value = "/passwordReset")
    public String passwordReset(@RequestParam("token") String token, @RequestParam("code") String code, Model model) {
        try {
            spiService.validateResetPasswordToken(token, code);
            return RESETPASSWORD_VIEW;
        } catch (HttpClientErrorException e) {
            if (HttpStatus.NOT_FOUND.equals(e.getStatusCode())) {
                model.addAttribute("forgotPasswordLink", buildUrlFromTheBody(e.getResponseBodyAsString()));
            }
        }
        return EXPIRED_PASSWORD_RESET_LINK_VIEW;
    }

    private String buildUrlFromTheBody(String responseBodyAsString) {
        try {
            uk.gov.hmcts.reform.idam.api.internal.model.ForgotPasswordDetails request = mapper.readValue(
                responseBodyAsString, uk.gov.hmcts.reform.idam.api.internal.model.ForgotPasswordDetails.class);
            if (Strings.isNotEmpty(request.getRedirectUri())) {
                return "/reset/forgotpassword?redirectUri=" + request.getRedirectUri() +
                    "&client_id=" + nullToEmpty(request.getClientId()) +
                    "&state=" + nullToEmpty(request.getState()) +
                    "&scope=" + nullToEmpty(request.getScope());
            }
        } catch (IOException ex) {
            log.error("Failed to read returned ForgotPasswordDetails", ex);

        }
        return "";
    }

    private String nullToEmpty(Object obj) {
        return Objects.toString(obj, "");
    }


    /**
     * @should put in model correct data and return forgot password view
     */
    @GetMapping("/reset/forgotpassword")
    public String resetForgotPassword(@ModelAttribute("forgotPasswordCommand") ForgotPasswordRequest forgotPasswordRequest) {
        return FORGOTPASSWORD_VIEW;
    }

    /**
     * @should put correct data in model and return login view
     * @should set self registration to false if disabled for the service
     * @should set self registration to false if the clientId is invalid
     * @should return error page view if OAuth2 details are missing
     * @should return hasOtpCheckCodeFailed on redirects and reject "Verification code failed"
     */
    @GetMapping("/login")
    public String loginView(@ModelAttribute(AUTHORIZE_COMMAND) AuthorizeRequest request,
                            BindingResult bindingResult, Model model) {
        if (StringUtils.isEmpty(request.getClient_id()) || StringUtils.isEmpty(request.getRedirect_uri())) {
            model.addAttribute(ERROR_MSG, "error.page.access.denied");
            model.addAttribute(ERROR_SUB_MSG, "public.error.page.access.denied.text");
            return ERRORPAGE_VIEW;
        }

        enableConfiguredClientFeatures(request, model);

        model.addAttribute(RESPONSE_TYPE, request.getResponse_type());
        model.addAttribute(STATE, request.getState());
        model.addAttribute(NONCE, request.getNonce());
        model.addAttribute(PROMPT, request.getPrompt());
        model.addAttribute(CLIENT_ID, request.getClient_id());
        model.addAttribute(REDIRECT_URI, request.getRedirect_uri());
        model.addAttribute(SCOPE, request.getScope());
        model.addAttribute(HAS_OTP_CHECK_FAILED, request.isHasOtpCheckFailed());
        model.addAttribute(MISSING_AUTHID_COOKIE, request.isMissingAuthIdCookie());

        if (request.isHasOtpCheckFailed()) {
            // redirecting from otp check
            bindingResult.reject("Verification code failed");
        }

        if (request.isMissingAuthIdCookie()) {
            // redirecting from otp check
            bindingResult.reject("Verification code failed");
        }

        return LOGIN_VIEW;
    }

    private void enableConfiguredClientFeatures(AuthorizeRequest request, Model model) {
        model.addAttribute(SELF_REGISTRATION_ENABLED, false);
        if (StringUtils.isNotBlank(request.getClient_id())) {
            Optional<Service> service = spiService.getServiceByClientId(request.getClient_id());
            service.ifPresent(theService -> {
                model.addAttribute(SELF_REGISTRATION_ENABLED, theService.isSelfRegistrationAllowed());
                if (!CollectionUtils.isEmpty(theService.getSsoProviders())
                    && theService.getSsoProviders().stream().anyMatch(SSO_LOGIN_HINTS::containsKey)
                    && configurationProperties.getFeatures().isFederatedSSO()) {
                    if (theService.getSsoProviders().contains(EJUDICIARY_AAD)) {
                        model.addAttribute(AZURE_LOGIN_ENABLED, true);
                    }
                    if (theService.getSsoProviders().contains(MOJ)) {
                        model.addAttribute(MOJ_LOGIN_ENABLED, true);
                    }
                }
            });
        }
    }

    /**
     * @should put in model correct data then call authorize service and redirect using redirect url returned by service
     * @should put in model correct data then call authorize service and redirect using redirect url returned by service that does not match redirect
     * @should put in model correct data if username or password are empty.
     * @should put in model the correct data and return login view if authorize service doesn't return a response url
     * @should put in model the correct error detail in case authorize service throws a HttpClientErrorException and status code is 403 then return login view
     * @should put in model the correct error variable in case authorize service throws a HttpClientErrorException and status code is not 403 then return login view
     * @should put in model the correct error variable in case policy check returns BLOCK
     * @should return forbidden if csrf token is invalid
     * @should not forward username password params on OTP
     */
    @PostMapping("/login")
    public ModelAndView login(@ModelAttribute(AUTHORIZE_COMMAND) @Validated AuthorizeRequest request,
                              BindingResult bindingResult, Model model, HttpServletRequest httpRequest,
                              HttpServletResponse response) throws IOException {
        model.addAttribute(USERNAME, request.getUsername());
        model.addAttribute(PASSWORD, request.getPassword());
        model.addAttribute(RESPONSE_TYPE, request.getResponse_type());
        model.addAttribute(STATE, request.getState());
        model.addAttribute(NONCE, request.getNonce());
        model.addAttribute(PROMPT, request.getPrompt());
        model.addAttribute(CLIENT_ID, request.getClient_id());
        model.addAttribute(REDIRECT_URI, request.getRedirect_uri());
        model.addAttribute(SCOPE, request.getScope());
        model.addAttribute(SELF_REGISTRATION_ENABLED, request.isSelfRegistrationEnabled());
        if (configurationProperties.getFeatures().isFederatedSSO()) {
            if (request.isAzureLoginEnabled()) {
                model.addAttribute(AZURE_LOGIN_ENABLED, true);
            }
            if (request.isMojLoginEnabled()) {
                model.addAttribute(MOJ_LOGIN_ENABLED, true);
            }
        }

        final boolean validationErrors = bindingResult.hasErrors();
        if (validationErrors) {
            if (StringUtils.isEmpty(request.getUsername())) {
                model.addAttribute("isUsernameEmpty", true);
            }
            if (StringUtils.isEmpty(request.getPassword())) {
                model.addAttribute("isPasswordEmpty", true);
            }
            model.addAttribute(HAS_ERRORS, true);
            return new ModelAndView(LOGIN_VIEW, model.asMap());
        }

        // automatically redirect SSO users
        if (configurationProperties.getFeatures().isFederatedSSO() && ssoService.isSSOEmail(request.getUsername())) {
            ssoService.redirectToExternalProvider(httpRequest, response, request.getUsername());
            return null;
        }

        try {
            final String ipAddress = ObjectUtils.defaultIfNull(httpRequest.getHeader(X_FORWARDED_FOR), httpRequest.getRemoteAddr());
            final String redirectUri = request.getRedirect_uri();

            final ApiAuthResult authenticationResult = spiService.authenticate(request.getUsername(), request.getPassword(), redirectUri, ipAddress);

            // API responded with success, it's either a successful login or a request for OTP
            if (authenticationResult.isSuccess()) {
                final List<String> cookies = authenticationResult.getCookies();
                if (cookies == null) {
                    log.info("/login: Authenticate returned no cookies for user - {}", obfuscateEmailAddress(request.getUsername()));
                    model.addAttribute(HAS_LOGIN_FAILED, true);
                    bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
                    return new ModelAndView(LOGIN_VIEW, model.asMap());
                }

                if (authenticationResult.requiresMfa()) {
                    log.info("/login: User requires mfa authentication - {}", obfuscateEmailAddress(request.getUsername()));

                    List<String> secureCookies = authHelper.makeCookiesSecure(cookies);
                    secureCookies.forEach(cookie -> response.addHeader(HttpHeaders.SET_COOKIE, cookie));

                    final List<String> affinityCookieNames = Optional.ofNullable(configurationProperties.getStrategic().getSession().getAffinityCookies()).orElse(new ArrayList<>());
                    cookies.stream()
                        .filter(cookie -> affinityCookieNames.stream().anyMatch(cookie::contains))
                        .forEach(cookie -> response.addHeader(HttpHeaders.SET_COOKIE, cookie.split(";")[0]));

                    Map<String, Object> authorizeParams = model.asMap();
                    authorizeParams.remove(USERNAME);
                    authorizeParams.remove(PASSWORD);
                    authorizeParams.remove(SELF_REGISTRATION_ENABLED);

                    return new ModelAndView(REDIRECT_PREFIX_WITH_SLASH + VERIFICATION_VIEW, authorizeParams);
                } else {
                    final String responseUrl = authoriseUserAfterAuthentication(cookies, httpRequest);
                    final boolean loginSuccess = responseUrl != null && !responseUrl.contains("error");

                    if (loginSuccess) {
                        if (responseUrl.startsWith(redirectUri)) {
                            log.info("/login: Successful login - {}", obfuscateEmailAddress(request.getUsername()));
                        } else {
                            log.info("/login: Successful for user {} with unexpected redirect {}", obfuscateEmailAddress(request.getUsername()), responseUrl);
                        }
                        List<String> secureCookies = authHelper.makeCookiesSecure(cookies);
                        secureCookies.forEach(cookie -> response.addHeader(HttpHeaders.SET_COOKIE, cookie));
                        return new ModelAndView(REDIRECT_PREFIX + responseUrl);
                    } else {
                        log.info("/login: There is a problem while logging in  user {}, response url is {}", obfuscateEmailAddress(request.getUsername()), responseUrl != null ? responseUrl : "n/a");
                        model.addAttribute(HAS_LOGIN_FAILED, true);
                        bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
                        return new ModelAndView(LOGIN_VIEW, model.asMap());
                    }
                }
            } else if (authenticationResult.getErrorCode() != null) {
                final ErrorResponse.CodeEnum errorCode = authenticationResult.getErrorCode();
                switch (errorCode) {
                    case ACCOUNT_LOCKED:
                        model.addAttribute(IS_ACCOUNT_LOCKED, true);
                        bindingResult.reject("Account locked");
                        return new ModelAndView(LOGIN_VIEW, model.asMap());
                    case ACCOUNT_SUSPENDED:
                        model.addAttribute(IS_ACCOUNT_SUSPENDED, true);
                        bindingResult.reject("Account suspended");
                        return new ModelAndView(LOGIN_VIEW, model.asMap());
                    case POLICIES_FAIL:
                        log.info("/login: User failed policy checks - {}", obfuscateEmailAddress(request.getUsername()));
                        model.addAttribute(HAS_POLICY_CHECK_FAILED, true);
                        bindingResult.reject("Policy check failure");
                        return new ModelAndView(LOGIN_VIEW, model.asMap());
                    case STALE_USER_REGISTRATION_SENT:
                        Map<String, Object> staleUserResetPasswordParams = model.asMap();
                        staleUserResetPasswordParams.remove(USERNAME);
                        staleUserResetPasswordParams.remove(PASSWORD);
                        staleUserResetPasswordParams.remove(SELF_REGISTRATION_ENABLED);
                        return new ModelAndView(REDIRECT_RESET_INACTIVE_USER, staleUserResetPasswordParams);
                    case ACCOUNT_LINKED_TO_EXTERNAL_PROVIDER:
                        Map<String, Object> redirectParams = setUpSSOParams(model, authenticationResult);
                        if (ssoAutoRedirect) {
                            return new ModelAndView(REDIRECT_OIDC_AUTHORIZE, redirectParams);
                        } else {
                            model.addAttribute(HAS_LOGIN_FAILED, true);
                            bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
                        }
                    default:
                        log.info("/login: Login failed ({}) for user - {}", errorCode, obfuscateEmailAddress(request.getUsername()));
                        model.addAttribute(HAS_LOGIN_FAILED, true);
                        bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
                }
            } else {
                log.info("/login: Login failed for user - {}", obfuscateEmailAddress(request.getUsername()));
                model.addAttribute(HAS_LOGIN_FAILED, true);
                bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
            }
        } catch (HttpClientErrorException | HttpServerErrorException he) {
            log.info("/login: Login failed ({}) for user - {}", he.getRawStatusCode(), obfuscateEmailAddress(request.getUsername()));
            model.addAttribute(HAS_LOGIN_FAILED, true);
            bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
        }
        return new ModelAndView(LOGIN_VIEW, model.asMap());
    }

    private Map<String, Object> setUpSSOParams(Model model, ApiAuthResult authenticationResult) {
        Map<String, Object> redirectParams = model.asMap();
        redirectParams.remove(USERNAME);
        redirectParams.remove(PASSWORD);
        redirectParams.remove(SELF_REGISTRATION_ENABLED);
        redirectParams.remove(AZURE_LOGIN_ENABLED);
        redirectParams.remove(MOJ_LOGIN_ENABLED);
        redirectParams.putIfAbsent(RESPONSE_TYPE, CODE);
        redirectParams.putIfAbsent(SCOPE, "openid roles profile");
        redirectParams.put("login_hint", SSO_IDAM_API_PROVIDER_MAP
            .getOrDefault(authenticationResult.getErrorInfo(), authenticationResult.getErrorInfo()));
        return redirectParams;
    }

    private String authoriseUserAfterAuthentication(List<String> cookies, HttpServletRequest httpRequest) {
        String responseUrl = null;
        if (cookies != null) {
            Map<String, String> params = new HashMap<>();
            httpRequest.getParameterMap().forEach((key, values) -> {
                    if (values.length > 0 && !String.join(" ", values).trim().isEmpty() && !key.equals(PROMPT))
                        params.put(key, String.join(" ", values));
                }
            );
            params.putIfAbsent(RESPONSE_TYPE, "code");
            params.putIfAbsent(SCOPE, "openid profile roles");

            responseUrl = spiService.authorize(params, cookies);
        }
        return responseUrl;
    }

    /**
     * @should return error page view if OAuth2 details are missing
     * @should populate authorizeCommand
     */
    @GetMapping("/verification")
    public String verificationView(@ModelAttribute(AUTHORIZE_COMMAND) VerificationRequest request,
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
        model.addAttribute(SCOPE, request.getScope());
        model.addAttribute(NONCE, request.getNonce());
        model.addAttribute(PROMPT, request.getPrompt());

        model.addAttribute(AUTHORIZE_COMMAND, request);

        return VERIFICATION_VIEW;
    }

    /**
     * @should submit otp authentication using authId cookie and otp code then call authorise and redirect the user
     * @should submit otp authentication using authId cookie and otp code then call authorise and redirect the user to unexpected response url
     * @should submit otp authentication filtering out Idam.Session cookie to avoid session bugs
     * @should return verification view for INCORRECT_OTP 401 response
     * @should return login view for TOO_MANY_ATTEMPTS_OTP 401 response
     * @should return verification view for expired OTP session 401 response
     * @should return login view for 403 response
     * @should return login view when authorize fails
     * @should return login view for when missing AuthId cookie
     * @should validate code field is not empty
     * @should validate code field is digits
     * @should validate code field is 8 digits
     */
    @PostMapping("/verification")
    public ModelAndView verification(@ModelAttribute(AUTHORIZE_COMMAND) @Validated VerificationRequest request,
                                     BindingResult bindingResult,
                                     Model model,
                                     HttpServletRequest httpRequest,
                                     HttpServletResponse response) {

        model.addAttribute(RESPONSE_TYPE, request.getResponse_type());
        model.addAttribute(STATE, request.getState());
        model.addAttribute(NONCE, request.getNonce());
        model.addAttribute(PROMPT, request.getPrompt());
        model.addAttribute(CLIENT_ID, request.getClient_id());
        model.addAttribute(REDIRECT_URI, request.getRedirect_uri());
        model.addAttribute(SCOPE, request.getScope());
        model.addAttribute(CODE, request.getCode());

        final boolean validationErrors = bindingResult.hasErrors();
        if (validationErrors) {
            final List<FieldError> codeErrors = ofNullable(bindingResult.getFieldErrors("code"))
                .orElse(Collections.emptyList());
            final List<String> errorCode = codeErrors.stream()
                .map(FieldError::getCode)
                .toList();
            if (errorCode.contains(NotEmpty.class.getSimpleName())) {
                model.addAttribute("isCodeEmpty", true);
            } else if (errorCode.contains(Pattern.class.getSimpleName())) {
                model.addAttribute("isCodePatternInvalid", true);
            } else if (errorCode.contains(Length.class.getSimpleName())) {
                model.addAttribute("isCodeLengthInvalid", true);
            }
            return new ModelAndView(VERIFICATION_VIEW, model.asMap());
        }

        final String ipAddress = ObjectUtils.defaultIfNull(httpRequest.getHeader(X_FORWARDED_FOR), httpRequest.getRemoteAddr());

        final String idamSessionCookie = configurationProperties.getStrategic().getSession().getIdamSessionCookie();
        final List<String> cookies = Arrays.stream(ofNullable(httpRequest.getCookies()).orElse(new Cookie[]{}))
            .filter(c -> !idamSessionCookie.equals(c.getName()))
            .map(c -> String.format("%s=%s", c.getName(), c.getValue())) // map to: "Idam.AuthId=xyz"
            .toList();

        try {
            final String authId = StringUtils.substringAfter(
                cookies.stream()
                    .filter(cookie -> cookie.startsWith(IDAM_AUTH_ID_COOKIE_PREFIX))
                    .findFirst()
                    .orElse(""),
                IDAM_AUTH_ID_COOKIE_PREFIX);

            if (authId.isEmpty()) {
                return redirectToLoginMissingAuthId(request, bindingResult, model);
            }

            final List<String> responseCookies = spiService.submitOtpeAuthentication(authId, ipAddress, request.getCode());
            log.info("/verification: Successful OTP submission request");

            final String responseUrl = authoriseUserAfterAuthentication(responseCookies, httpRequest);
            final boolean loginSuccess = responseUrl != null && !responseUrl.contains("error");
            if (loginSuccess) {
                if (responseUrl.startsWith(request.getRedirect_uri())) {
                    log.info("/verification: Successful login");
                } else {
                    log.info("/verification: Successful login with unexpected redirect {}", responseUrl);
                }
                List<String> secureCookies = authHelper.makeCookiesSecure(responseCookies);
                secureCookies.forEach(cookie -> response.addHeader(HttpHeaders.SET_COOKIE, cookie));
                return new ModelAndView(REDIRECT_PREFIX + responseUrl);
            } else {
                log.info("/verification: There is a problem while logging in user, response url is {}", responseUrl != null ? responseUrl : "n/a");
                return redirectToLoginOnFailedOtpVerification(request, bindingResult, model);
            }
        } catch (HttpClientErrorException | HttpServerErrorException he) {
            log.info("/verification: Login failed for user");
            if (HttpStatus.UNAUTHORIZED == he.getStatusCode()) {

                ErrorResponse error = new ErrorResponse();
                if (he.getResponseBodyAsString() != null) {
                    try {
                        error = objectMapper.readValue(he.getResponseBodyAsString(), ErrorResponse.class);
                    } catch (IOException e) {
                        // ignored
                    }
                }
                if (ErrorResponse.CodeEnum.INCORRECT_OTP.equals(error.getCode())) {
                    model.addAttribute(HAS_OTP_CHECK_FAILED, true);
                    bindingResult.reject("Incorrect OTP");
                    Optional.ofNullable(
                        Optional.ofNullable(he.getResponseHeaders())
                            .orElse(new HttpHeaders())
                            .get(HttpHeaders.SET_COOKIE))
                        .orElse(new ArrayList<>())
                        .stream()
                        .filter(cookie -> cookie.startsWith(IDAM_AUTH_ID_COOKIE_PREFIX))
                        .map(cookie -> StringUtils.substringAfter(cookie, IDAM_AUTH_ID_COOKIE_PREFIX))
                        .findFirst()
                        .ifPresent(authId -> response.addCookie(new Cookie("Idam.AuthId", authId)));
                    return new ModelAndView(VERIFICATION_VIEW, model.asMap());
                }

                return redirectToExpiredCode(model);
            }

            return redirectToLoginOnFailedOtpVerification(request, bindingResult, model);
        }
    }

    private ModelAndView redirectToLoginOnFailedOtpVerification(VerificationRequest request,
                                                                BindingResult bindingResult,
                                                                Model model) {
        model.addAttribute("hasOtpCheckFailed", true);
        bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
        model.addAttribute(AUTHORIZE_COMMAND, request);
        model.addAttribute(USERNAME, null);
        return new ModelAndView(REDIRECT_PREFIX_WITH_SLASH + LOGIN_VIEW, model.asMap());
    }

    private ModelAndView redirectToLoginMissingAuthId(VerificationRequest request,
                                                                BindingResult bindingResult,
                                                                Model model) {
        model.addAttribute("missingAuthIdCookie", true);
        bindingResult.reject(LOGIN_FAILURE_ERROR_CODE);
        model.addAttribute(AUTHORIZE_COMMAND, request);
        model.addAttribute(USERNAME, null);
        return new ModelAndView(REDIRECT_PREFIX_WITH_SLASH + LOGIN_VIEW, model.asMap());
    }

    private ModelAndView redirectToExpiredCode(Model model) {
        return new ModelAndView(REDIRECT_PREFIX_WITH_SLASH + EXPIRED_CODE_VIEW, model.asMap());
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
    @PostMapping("/register")
    public ModelAndView upliftLogin(@Validated UpliftRequest request, BindingResult bindingResult,
                                    final Map<String, Object> model, ModelMap modelMap) {

        if (bindingResult.hasErrors()) {
            ErrorHelper.showLoginError("There is a problem",
                "Please fix the following",
                request.getRedirect_uri(),
                model);
            return new ModelAndView(UPLIFT_LOGIN_VIEW, modelMap);
        }

        String redirectUrl = REDIRECT_PREFIX;
        try {
            final String jsonResponse = spiService.uplift(request.getUsername(), request.getPassword(), request.getJwt(),
                request.getRedirect_uri(), request.getClient_id(), request.getState(), request.getScope());
            if (jsonResponse != null) {
                redirectUrl += jsonResponse;
            }
        } catch (HttpClientErrorException ex) {
            if (StringUtils.isNotBlank(ex.getResponseBodyAsString())
                && ex.getResponseBodyAsString().equalsIgnoreCase(STALE_USER_REGISTRATION_SENT.toString())) {
                model.remove("upliftRequest");
                model.put(CLIENT_ID, request.getClient_id());
                model.put(REDIRECT_URI, request.getRedirect_uri());
                model.put(STATE, request.getState());
                model.put(NONCE, request.getNonce());
                model.put(SCOPE, request.getScope());
                return new ModelAndView(REDIRECT_RESET_INACTIVE_USER, model);
            } else {
                log.error("Uplift process exception: {}", ex.getMessage(), ex);

                ErrorHelper.showLoginError("Incorrect email/password combination",
                    "Please check your email address and password and try again",
                    request.getRedirect_uri(),
                    model);
                return new ModelAndView(UPLIFT_LOGIN_VIEW, modelMap);
            }
        } catch (Exception ex) {
            log.error("Uplift process exception: {}", ex.getMessage());

            ErrorHelper.showLoginError("Sorry, there was an error",
                "Please try your action again.",
                request.getRedirect_uri(),
                model);
            return new ModelAndView(UPLIFT_LOGIN_VIEW, modelMap);
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
                               Map<String, Object> model) { //NOSONAR

        //Quick null check to avoid calling backend
        if (StringUtils.isBlank(pin)) {
            ErrorHelper.showLoginError("public.login.with.pin.valid.security.code.error", "public.login.with.pin.security.code.incorrect.error", redirectUri, model);
            return LOGIN_WITH_PIN_VIEW;
        }

        try {

            return REDIRECT_PREFIX + spiService.loginWithPin(pin, redirectUri, state, clientId); //NOSONAR

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
     * @should return forgot password success view when there are no errors and service does not have self registration enabled
     * @should return forgot password view with correct model data when there are validation errors
     * @should return error view when there is an unexpected error
     */
    @PostMapping(value = "/reset/doForgotPassword")
    public String forgotPassword(@ModelAttribute("forgotPasswordCommand") @Validated ForgotPasswordRequest
                                     forgotPasswordRequest,
                                 final BindingResult bindingResult,
                                 final Map<String, Object> model) {
        model.put(REDIRECTURI, forgotPasswordRequest.getRedirectUri());
        model.put(CLIENT_ID, forgotPasswordRequest.getClient_id());
        model.put(EMAIL, forgotPasswordRequest.getEmail());
        model.put(STATE, forgotPasswordRequest.getState());
        model.put(NONCE, forgotPasswordRequest.getNonce());
        model.put(SCOPE, forgotPasswordRequest.getScope());

        try {
            if (!bindingResult.hasErrors()) {
                spiService.forgetPassword(
                    forgotPasswordRequest.getEmail(),
                    forgotPasswordRequest.getRedirectUri(),
                    forgotPasswordRequest.getClient_id());

                model.put(SELF_REGISTRATION_ENABLED, isSelfRegistrationEnabled(forgotPasswordRequest.getClient_id()));

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
     * @should put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password contains personal info then return reset password view.
     * @should put in model the correct error code if HttpClientErrorException with http 400 is thrown by service and password is previously used then return reset password view.
     * @should not put redirect uri in model if service returns http 200 and redirect uri is not present in response then return reset password success view
     * @should redirect to expired token if HttpClientErrorException with http 404 is thrown by service.
     * @should return reset password view if request validation fails.
     */
    @PostMapping(value = "/doResetPassword")
    public String resetPassword(final String action, final String password1, final String password2,
                                final String token, final String code, final Map<String, Object> model) throws IOException {
        try {
            if (validationService.validatePassword(password1, password2, model)) {
                ResponseEntity<String> resetPasswordEntity = spiService.resetPassword(password1, token, code);

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
                ErrorHelper.showError(ERROR_TITLE, "public.common.error.invalid.password", "public.common.error.invalid.password", "", model);
            } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED)) {
                    ErrorHelper.showError(ERROR_TITLE, "public.common.error.blacklisted.password", "public.common.error.blacklisted.password", "public.common.error.enter.password", model);
                } else if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.PASSWORD_CONTAINS_PERSONAL_INFO)) {
                    ErrorHelper.showError(ERROR_TITLE, "public.common.error.containspersonalinfo.password", "public.common.error.containspersonalinfo.password", "public.common.error.enter.password", model);
                } else if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.ACCOUNT_LOCKED)) {
                    ErrorHelper.showError(ERROR_TITLE, "public.common.error.previously.used.password", "public.common.error.password.details", "public.common.error.enter.password", model);
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

    private boolean checkUserAuthorised(String jwt, Map<String, Object> model) {
        Optional<User> user = spiService.getDetails(jwt);

        if (user.isEmpty()) {
            model.put(ERROR_MSG, "error.page.not.authorized");
            model.put(ERROR_SUB_MSG, "public.error.page.please.contact.admin");
            return false;
        }

        return true;
    }

    private String obfuscateEmailAddress(String email) {
        return email.replaceAll("((^[^@]{3})|(?!^)\\G)[^@]", "$2*");
    }

    /**
     * @should return view
     */
    @GetMapping("/cookie-preferences")
    public String cookiePreferencesView() {
        return COOKIE_PREFERENCES_VIEW;
    }

    /**
     * @should return view
     */
    @GetMapping("/accessibility-statement")
    public String accessibilityStatementView() {
        return ACCESSIBILITY_STATEMENT_VIEW;
    }

    /**
     * @should return view
     */
    @GetMapping("/cookies")
    public String cookiesView() {
        if (configurationProperties.getFeatures().getExternalCookiePage().isEnabled()) {
            return REDIRECT_PREFIX + configurationProperties.getFeatures().getExternalCookiePage().getUrl();
        } else {
            return COOKIES_VIEW;
        }
    }

    /**
     * @should return view
     */
    @GetMapping("/privacy-policy")
    public String privacyPolicyView() {
        return PRIVACY_POLICY_VIEW;
    }

    /**
     * @should return view
     */
    @GetMapping("/terms-and-conditions")
    public String termsAndConditionsView() {
        return TERMS_AND_CONDITIONS_VIEW;
    }

    /**
     * @should return view
     */
    @GetMapping("/contact-us")
    public String contactUsView() {
        if (configurationProperties.getFeatures().getExternalContactPage().isEnabled()) {
            return REDIRECT_PREFIX + configurationProperties.getFeatures().getExternalContactPage().getUrl();
        } else {
            return CONTACT_US_VIEW;
        }
    }

    /**
     * @should return staleUserResetPassword
     */
    @GetMapping("/reset/inactive-user")
    public String resetPasswordStaleUser(@RequestParam("client_id") String clientId,
                                         @RequestParam("redirect_uri") String redirectUri,
                                         @RequestParam(required = false) String state,
                                         @RequestParam(required = false) String nonce,
                                         @RequestParam(required = false) String scope,
                                         Model model) {
        model.addAttribute(SELF_REGISTRATION_ENABLED, isSelfRegistrationEnabled(clientId));
        model.addAttribute(CLIENT_ID, clientId);
        model.addAttribute(REDIRECTURI, redirectUri);
        model.addAttribute(STATE, state);
        model.addAttribute(SCOPE, scope);
        model.addAttribute(NONCE, nonce);
        return STALE_USER_RESET_PASSWORD_VIEW;
    }

    private boolean isSelfRegistrationEnabled(String clientId) {
        if (Objects.nonNull(clientId) && !clientId.isEmpty()) {
            Optional<Service> service = spiService.getServiceByClientId(clientId);
            return service.isPresent() && service.get().isSelfRegistrationAllowed();
        }
        return false;
    }

    /**
     * @should return an error page
     */
    @GetMapping(path = "/auth-error")
    public String authorizeError(final Map<String, Object> model) {
        model.put(ERROR_MSG, GENERIC_ERROR_KEY);
        model.put(ERROR_SUB_MSG, GENERIC_SUB_ERROR_KEY);
        return ERRORPAGE_VIEW;
    }

    @GetMapping(path = "/expiredcode")
    public String expiredCodeError(@RequestParam("client_id") String clientId,
                                   @RequestParam("redirect_uri") String redirectUri,
                                   @RequestParam(required = false) String state,
                                   @RequestParam(required = false) String scope,
                                   @RequestParam(required = false) String nonce,
                                   @RequestParam(required = false) String prompt,
                                   Model model) {
        model.addAttribute(CLIENT_ID, clientId);
        model.addAttribute(REDIRECTURI, redirectUri);
        model.addAttribute(STATE, state);
        model.addAttribute(SCOPE, scope);
        model.addAttribute(NONCE, nonce);
        model.addAttribute(PROMPT, prompt);
        return EXPIRED_CODE_VIEW;
    }
}
