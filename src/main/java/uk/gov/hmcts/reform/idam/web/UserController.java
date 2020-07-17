package uk.gov.hmcts.reform.idam.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.util.encoders.Base64;
import org.owasp.encoder.Encode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.servlet.ModelAndView;
import uk.gov.hmcts.reform.idam.api.internal.model.ActivationResult;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.api.internal.model.Service;
import uk.gov.hmcts.reform.idam.api.internal.model.ValidateRequest;
import uk.gov.hmcts.reform.idam.web.helper.ErrorHelper;
import uk.gov.hmcts.reform.idam.web.model.RegisterFormData;
import uk.gov.hmcts.reform.idam.web.model.SelfRegisterRequest;
import uk.gov.hmcts.reform.idam.web.strategic.SPIService;
import uk.gov.hmcts.reform.idam.web.strategic.ValidationService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.CLIENTID;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.ERRORPAGE_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.EXPIRED_ACTIVATION_LINK_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.REDIRECTURI;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.SCOPE;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.SELF_REGISTER_VIEW;
import static uk.gov.hmcts.reform.idam.web.helper.MvcKeys.STATE;

@Controller
@RequestMapping("/users")
@Slf4j
public class UserController {

    private static final String ERROR_MSG = "errorMsg";
    private static final String ERROR_SUB_MSG = "errorSubMsg";
    static final String GENERIC_ERROR_KEY = "public.error.page.generic.error";
    static final String GENERIC_SUB_ERROR_KEY = "public.error.page.generic.sub.error";
    private static final String ALREADY_ACTIVATED_KEY = "public.error.page.already.activated.description";
    private static final String PAGE_NOT_FOUND_VIEW = "404";

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private SPIService spiService;

    @Autowired
    private ValidationService validationService;

    /**
     * @should return users view
     */
    @RequestMapping(method = RequestMethod.GET)
    public String users(final Map<String, Object> model) {

        return "users";
    }

    /**
     * @should return expiredtoken view and  have redirect_uri attribute in model  if token expired
     * @should return useractivation view and no redirect_uri attribute in model if the token is valid
     * @should return errorpage view error message and no redirect_uri attribute in model if api returns server error
     * @should return errorpage view error message for already activated account and no redirect_uri attribute in model if api returns status 409
     */
    @GetMapping("/register")
    public String userActivation(@RequestParam("token") String token, @RequestParam("code") String code, final Map<String, Object> model) {
        ValidateRequest validateRequest = new ValidateRequest();
        validateRequest.setCode(code);
        validateRequest.setToken(token);
        ResponseEntity<ActivationResult> responseEntity;

        try {
            responseEntity = spiService.validateActivationToken(validateRequest);

            ActivationResult activationResult = responseEntity.getBody();
            if (Objects.nonNull(activationResult)) {
                log.info("The token {} has expired", token);
                model.put("redirect_uri", buildRegistrationLink(activationResult));
                return EXPIRED_ACTIVATION_LINK_VIEW;
            }
            model.put("token", token);
            model.put("code", code);

        } catch (HttpServerErrorException | HttpClientErrorException e) {
            log.error("An error occurred validating user activation token: {}", token);
            log.error("Response body: {}", e.getResponseBodyAsString(), e);
            if (e.getStatusCode().equals(HttpStatus.CONFLICT)) {
                model.put(ERROR_MSG, ALREADY_ACTIVATED_KEY);
            } else {
                model.put(ERROR_MSG, GENERIC_ERROR_KEY);
                model.put(ERROR_SUB_MSG, GENERIC_SUB_ERROR_KEY);
            }
            return "errorpage";
        }
        return "useractivation";
    }

    /**
     * @should return null if redirecturi or clientid are empty
     * @should build link if redirecturi and clientid are present
     */
    String buildRegistrationLink(ActivationResult activationResult) {
        String redirectUri = activationResult.getRedirectUri();
        String clientId = activationResult.getClientId();
        if (isBlank(redirectUri) || isBlank(clientId)) {
            return null;
        }
        return "/users/selfRegister?redirect_uri=" + redirectUri +
            "&client_id=" + clientId;
    }

    /**
     * @should populate the model with the users details if called with a valid form_data param
     * @should call spi service with correct parameter then return selfRegister view and  have redirect_uri, selfRegisterCommand, client_id attributes in model if self registration is allowed for service
     * @should return 404 view if clientId or redirectUri are missing
     * @should return generic error with generic error message if an exception is thrown
     * @should return 404 view if service is empty
     * @should return 404 view if self registration is not allowed
     */

    @GetMapping(path = "/selfRegister")
    public String selfRegister(
        @RequestParam(name = "form_data", required = false) String formData,
        @RequestParam(name = "redirect_uri", required = false) String redirectUri,
        @RequestParam(name = "client_id", required = false) String clientId,
        @RequestParam(name = "state", required = false) String state,
        @RequestParam(name = "scope", required = false) String scope,
        Model model) {

        parseFormData(formData, model);

        Optional<Service> service;

        if (isEmpty(clientId) || isEmpty(redirectUri)) {
            return PAGE_NOT_FOUND_VIEW;
        }

        try {
            service = spiService.getServiceByClientId(clientId);
        } catch (HttpServerErrorException | HttpClientErrorException e) {
            log.error("An error occurred getting service with clientId: {}", clientId);
            log.error("Response body: {}", e.getResponseBodyAsString(), e);
            model.addAttribute(ERROR_MSG, GENERIC_ERROR_KEY);
            return ERRORPAGE_VIEW;
        } catch (Exception e) {
            log.error("An error occurred getting service with clientId: {}", clientId);
            model.addAttribute(ERROR_MSG, GENERIC_ERROR_KEY);
            model.addAttribute(ERROR_SUB_MSG, GENERIC_SUB_ERROR_KEY);
            return ERRORPAGE_VIEW;
        }

        if (service.isPresent() && service.get().isSelfRegistrationAllowed()) {
            model.addAttribute("selfRegisterCommand", new SelfRegisterRequest());
            model.addAttribute(REDIRECTURI, redirectUri);
            model.addAttribute(CLIENTID, clientId);
            model.addAttribute(STATE, state);
            model.addAttribute(SCOPE, scope);
            return SELF_REGISTER_VIEW;
        }

        return PAGE_NOT_FOUND_VIEW;
    }

    private void parseFormData(final String formData, final Model model) {
        if (formData != null) {
            try {
                final RegisterFormData data = mapper
                    .readerFor(RegisterFormData.class)
                    .readValue(Base64.decode(formData.getBytes()));
                model.addAttribute("firstName", Encode.forHtml(data.getFirstName()));
                model.addAttribute("lastName", Encode.forHtml(data.getLastName()));
                model.addAttribute("email", Encode.forHtml(data.getEmail()));
            } catch (Exception e) {
                log.error("form_data parameter could not be parsed", e);
            }
        }
    }

    /**
     * @should return selfRegister view if request mandatory fields validation fails
     * @should return selfRegister view if email field is invalid
     * @should return usercreated view  if selfRegisterUser service returns http status 200
     * @should return errorpage  view and error message in model if selfRegisterUser service throws HttpClientErrorException and Http code is not 409
     * @should return usercreated view  if selfRegisterUser service throws HttpClientErrorException and Http code is 409
     * @should return errorpage view and error message in model if selfRegisterUser service throws HttpServerErrorException
     */
    @RequestMapping(path = "/selfRegister", method = RequestMethod.POST)
    public String selfRegisterUser(@ModelAttribute("selfRegisterCommand") @Validated SelfRegisterRequest selfRegisterRequest,
                                   BindingResult bindingResult,
                                   Model model) throws JsonProcessingException {

        // Preserve query parameters
        model.addAttribute("redirectUri", selfRegisterRequest.getRedirectUri());
        model.addAttribute("clientId", selfRegisterRequest.getClientId());
        model.addAttribute("state", selfRegisterRequest.getState());

        if (bindingResult.hasErrors()) {

            return "selfRegister";
        }

        try {
            ResponseEntity<String> responseEntity = spiService.selfRegisterUser(selfRegisterRequest);

            if (responseEntity.getStatusCode().equals(HttpStatus.OK)) {
                model.addAttribute("email", selfRegisterRequest.getEmail());
            }

            return "usercreated";

        } catch (HttpServerErrorException se) {
            log.error("Server error during user registration, Error body: {}", se.getResponseBodyAsString(), se);

        } catch (HttpClientErrorException ce) {
            if (ce.getStatusCode().equals(HttpStatus.CONFLICT)) {
                model.addAttribute("email", selfRegisterRequest.getEmail());
                return "usercreated";
            }
            log.error("Client error during user registration, Error body: {}", ce.getResponseBodyAsString(), ce);
        }
        model.addAttribute(ERROR_MSG, GENERIC_ERROR_KEY);
        model.addAttribute(ERROR_SUB_MSG, GENERIC_SUB_ERROR_KEY);
        return "errorpage";
    }

    /**
     * @should return useractivated view and redirect uri in model if returned by spiService if request mandatory fields validation succeeds
     * @should return useractivation view and blacklisted password error in model if HttpClientErrorException occurs and http status is 400 and password is blacklisted
     * @should return useractivation view and invalid passowrd error in model if HttpClientErrorException occurs and http status is 400 and password is not blacklisted
     * @should return expiredtoken view if HttpClientErrorException occurs and http status is 400 and token is invalid
     * @should return redirect expiredtoken page if selfRegisterUser service throws HttpClientErrorException and Http code is 404
     */
    @PostMapping("/activate")
    public ModelAndView activateUser(@RequestParam("token") String token, @RequestParam("code") String code,
                                     @RequestParam("password1") String password1, @RequestParam("password2") String password2,
                                     final Map<String, Object> model) throws IOException {
        model.put("token", token);
        model.put("code", code);
        try {
            if (validationService.validatePassword(password1, password2, model)) {
                String activation = "{\"token\":\"" + token + "\",\"code\":\"" + code + "\",\"password\":\"" + password1 + "\"}";
                ResponseEntity<ActivationResult> response = spiService.activateUser(activation);
                ActivationResult activationResult = response.getBody();
                // don't expose parameters other than the url to a GET request
                Map<String, Object> successModel = new HashMap<>();
                if (activationResult.getRedirectUri() != null) {
                    successModel.put("redirectUri", activationResult.getRedirectUri());
                }

                if(activationResult.isStaleUserActivated()){
                    return new ModelAndView("redirect:reset-password-success", successModel);
                }
                return new ModelAndView("redirect:useractivated", successModel);
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                // don't expose the token in the error page
                return new ModelAndView("redirect:expiredtoken", (Map<String, ?>) null);
            }

            if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED)) {
                    ErrorHelper.showError("Error",
                        "public.common.error.blacklisted.password",
                        "public.common.error.blacklisted.password",
                        "public.common.error.enter.password",
                        model);
                    return new ModelAndView("useractivation");
                }

                if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.PASSWORD_CONTAINS_PERSONAL_INFO)) {
                    ErrorHelper.showError("Error",
                        "public.common.error.containspersonalinfo.password",
                        "public.common.error.containspersonalinfo.password",
                        "public.common.error.enter.password",
                        model);
                    return new ModelAndView("useractivation");
                }

                if (validationService.isErrorInResponse(e.getResponseBodyAsString(), ErrorResponse.CodeEnum.TOKEN_INVALID)) {
                    return new ModelAndView("redirect:expiredtoken", model);
                }
            }

            ErrorHelper.showError("Error",
                "public.common.error.invalid.password",
                "public.common.error.invalid.password",
                "public.common.error.enter.password",
                model);
        }

        return new ModelAndView("useractivation");
    }

    @GetMapping("/useractivated")
    public String userActivated(@RequestParam(required = false) final String redirectUri, final Map<String, Object> model) {
        if (redirectUri != null) {
            model.put("redirectUri", redirectUri);
        }
        return "useractivated";
    }

    @GetMapping("/reset-password-success")
    public String resetPasswordSuccess(@RequestParam(required = false) final String redirectUri, Model model) {
        Optional.ofNullable(redirectUri).ifPresent(rUri -> model.addAttribute("redirectUri", rUri));

        return "resetpasswordsuccess";
    }

    @GetMapping("/expiredtoken")
    public String expiredToken(final Map<String, Object> model) {
        return "expiredtoken";
    }

}
