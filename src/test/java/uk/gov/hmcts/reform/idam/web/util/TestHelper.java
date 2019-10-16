package uk.gov.hmcts.reform.idam.web.util;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import uk.gov.hmcts.reform.idam.api.internal.model.ActivationResult;
import uk.gov.hmcts.reform.idam.api.internal.model.Service;
import uk.gov.hmcts.reform.idam.api.shared.model.User;
import uk.gov.hmcts.reform.idam.web.model.SelfRegisterRequest;

import java.net.URL;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static uk.gov.hmcts.reform.idam.web.util.TestConstants.*;

public class TestHelper {

    public static ActivationResult getActivationResult(String uuid, String redirectUri, String clientId) {
        ActivationResult activationResult = new ActivationResult();
        activationResult.setUuid(uuid);
        activationResult.setRedirectUri(redirectUri);
        activationResult.setClientId(clientId);
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

    /**
     * With the removal of letter-holder, an "authorized" user is just.. anybody
     * @return a User
     */
    public static User anAuthorizedUser() {
        return new User();
    }

    public static ResponseEntity getFoundResponseEntity(String url) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        headers.setLocation(new URL(url).toURI());
        return new ResponseEntity<>("", headers, HttpStatus.FOUND);
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

    public static Service getService(String label, String clientId, boolean selfRegistrationAllowed){
        return new Service().label(label).oauth2ClientId(clientId).selfRegistrationAllowed(selfRegistrationAllowed);
    }
}
