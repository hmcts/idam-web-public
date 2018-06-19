package uk.gov.hmcts.reform.idam.web.util;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.ACTIVATE_USER_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CLIENT_ID;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.CODE_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_ONE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.PASSWORD_TWO;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.REDIRECT_URI;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.SELF_REGISTER_ENDPOINT;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.STATE;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.TOKEN_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_EMAIL_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_FIRST_NAME_PARAMETER;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.USER_LAST_NAME_PARAMETER;

import java.net.URL;
import java.util.Arrays;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import uk.gov.hmcts.reform.idam.api.model.ActivationResult;
import uk.gov.hmcts.reform.idam.api.model.User;
import uk.gov.hmcts.reform.idam.web.model.SelfRegisterRequest;

public class TestHelper {


    public static ActivationResult getActivationResult(String uuid, String redirectUri) {
        ActivationResult activationResult = new ActivationResult();
        activationResult.setUuid(uuid);
        activationResult.setRedirectUri(redirectUri);
        return activationResult;
    }

    public static RequestBuilder getSelfRegisterPostRequest(String email, String firstName, String lastName) {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.post(SELF_REGISTER_ENDPOINT).with(csrf())
            .param(USER_FIRST_NAME_PARAMETER, firstName)
            .param(USER_LAST_NAME_PARAMETER, lastName)
            .param(USER_EMAIL_PARAMETER, email);
        return requestBuilder;
    }

    public static RequestBuilder getActivateUserPostRequest(String token, String code, String password1, String password2) {
        RequestBuilder requestBuilder = MockMvcRequestBuilders.post(ACTIVATE_USER_ENDPOINT).with(csrf())
            .param(TOKEN_PARAMETER, token)
            .param(CODE_PARAMETER, code)
            .param(PASSWORD_ONE, password1)
            .param(PASSWORD_TWO, password2);
        return requestBuilder;
    }

    public static User anAuthorizedUser() {
        User user = new User();
        user.setRoles(Arrays.asList("letter-holder"));
        return user;
    }

    public static ResponseEntity getFoundResponseEntity(String url) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.setLocation(new URL(url).toURI());
        return new ResponseEntity<String>("", headers, HttpStatus.FOUND);
    }

    public static SelfRegisterRequest getSelfRegisterRequest() {
        SelfRegisterRequest selfRegisterRequest = new SelfRegisterRequest();

        selfRegisterRequest.setClientId(CLIENT_ID);
        selfRegisterRequest.setEmail(USER_EMAIL);
        selfRegisterRequest.setFirstName(USER_FIRST_NAME);
        selfRegisterRequest.setLastName(USER_LAST_NAME);
        selfRegisterRequest.setRedirectUri(REDIRECT_URI);
        selfRegisterRequest.setState(STATE);

        return selfRegisterRequest;
    }
}
