package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.web.util.TestConstants;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

/**
 * @author Ivano
 */
@RunWith(MockitoJUnitRunner.class)
public class ValidationServiceTest {


    @Mock
    private ObjectMapper mapper;

    private ValidationService validationService;

    @Before
    public void setUp() {
        validationService = new ValidationService(8, 256, mapper);
    }

    /**
     * @verifies return false if the passwords is null or empty
     * @see ValidationService#validatePassword(String, String, java.util.Map)
     */
    @Test public void validatePassword_shouldReturnFalseIfThePasswordsIsNullOrEmpty() throws Exception {

        Map<String, Object> model = new HashMap<>();
        assertFalse(validationService.validatePassword(null, TestConstants.USER_PASSWORD, model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), Matchers.is(TestConstants.ERROR_PASSWORD_NOT_EMPTY)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.ERROR_ENTER_PASSWORD)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), Matchers.is(TestConstants.BLANK)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.PASSWORD_TWO), Matchers.is(TestConstants.USER_PASSWORD)));

        model = new HashMap<>();
        assertFalse(validationService.validatePassword(TestConstants.USER_PASSWORD, "", model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), Matchers.is(TestConstants.ERROR_PASSWORD_NOT_EMPTY)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.BLANK)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), Matchers.is(TestConstants.ERROR_ENTER_PASSWORD)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.PASSWORD_ONE), Matchers.is(TestConstants.USER_PASSWORD)));


    }

    /**
     * @verifies return false if the passwords don't match
     * @see ValidationService#validatePassword(String, String, java.util.Map)
     */
    @Test public void validatePassword_shouldReturnFalseIfThePasswordsDontMatch() throws Exception {

        Map<String, Object> model = new HashMap<>();

        assertFalse(validationService.validatePassword(TestConstants.PASSWORD_ONE, TestConstants.PASSWORD_TWO, model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), is("public.common.error.password.not.same")));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.BLANK)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), is("public.common.error.password.should.match")));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.PASSWORD_ONE), Matchers.is(TestConstants.PASSWORD_ONE)));
    }

    /**
     * @verifies return false if the password does not comply with the length requirement
     * @see ValidationService#validatePassword(String, String, java.util.Map)
     */
    @Test public void validatePassword_shouldReturnFalseIfThePasswordDoesNotComplyWithTheLengthRequirement() throws Exception {

        Map<String, Object> model = new HashMap<>();

        assertFalse(validationService.validatePassword(TestConstants.SHORT_PASSWORD, TestConstants.SHORT_PASSWORD, model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), Matchers.is(TestConstants.ERROR_INVALID_PASSWORD)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.ERROR_PASSWORD_DETAILS)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), Matchers.is(TestConstants.BLANK)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.PASSWORD_ONE), Matchers.is(TestConstants.SHORT_PASSWORD)));

        model = new HashMap<>();

        assertFalse(validationService.validatePassword(TestConstants.LONG_PASSWORD, TestConstants.LONG_PASSWORD, model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), Matchers.is(TestConstants.ERROR_INVALID_PASSWORD)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.ERROR_PASSWORD_DETAILS)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), Matchers.is(TestConstants.BLANK)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.PASSWORD_ONE), Matchers.is(TestConstants.LONG_PASSWORD)));

    }

    /**
     * @verifies return false if both passwords are null or empty
     * @see ValidationService#validatePassword(String, String, Map)
     */
    @Test
    public void validatePassword_shouldReturnFalseIfBothPasswordsAreNullOrEmpty() throws Exception {
        Map<String, Object> model = new HashMap<>();

        assertFalse(validationService.validatePassword(null, null, model));

        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR), Matchers.is(TestConstants.ERROR)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_TITLE), Matchers.is(TestConstants.ERROR_CAPITAL)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_MESSAGE), Matchers.is(TestConstants.ERROR_PASSWORD_NOT_EMPTY)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_ONE), Matchers.is(TestConstants.ERROR_ENTER_PASSWORD)));
        assertThat(model, Matchers.hasEntry(Matchers.is(TestConstants.ERROR_LABEL_TWO), Matchers.is(TestConstants.ERROR_ENTER_PASSWORD)));
    }

    /**
     * @verifies return true if both passwords are present and comply with the length requirement and are equal
     * @see ValidationService#validatePassword(String, String, Map)
     */
    @Test
    public void validatePassword_shouldReturnTrueIfBothPasswordsArePresentAndComplyWithTheLengthRequirementAndAreEqual() throws Exception {
        assertTrue(validationService.validatePassword(TestConstants.USER_PASSWORD, TestConstants.USER_PASSWORD, new HashMap<>()));
    }

    /**
     * @verifies return false if error code is not present in response body
     * @see ValidationService#isErrorInResponse(String, ErrorResponse.CodeEnum)
     */
    @Test
    public void isErrorInResponse_shouldReturnFalseIfErrorCodeIsNotPresentInResponseBody() throws Exception {
        given(mapper.readValue(eq(TestConstants.PASSWORD_BLACKLISTED_RESPONSE), eq(ErrorResponse.class))).willReturn(new ErrorResponse().code(ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED));

        assertFalse(validationService.isErrorInResponse(TestConstants.PASSWORD_BLACKLISTED_RESPONSE, ErrorResponse.CodeEnum.TOKEN_INVALID));
    }

    /**
     * @verifies return true if error code is present in response body
     * @see ValidationService#isErrorInResponse(String, ErrorResponse.CodeEnum)
     */
    @Test
    public void isErrorInResponse_shouldReturnTrueIfErrorCodeIsPresentInResponseBody() throws Exception {
        given(mapper.readValue(eq(TestConstants.PASSWORD_BLACKLISTED_RESPONSE), eq(ErrorResponse.class))).willReturn(new ErrorResponse().code(ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED));

        assertTrue(validationService.isErrorInResponse(TestConstants.PASSWORD_BLACKLISTED_RESPONSE, ErrorResponse.CodeEnum.PASSWORD_BLACKLISTED));
    }

    /**
     * @verifies return false if the password contains illegal characters
     * @see ValidationService#validatePassword(String, String, Map)
     */
    @Test
    public void validatePassword_shouldReturnFalseIfThePasswordContainsIllegalCharacters() throws Exception {
        String aPassword = "abcabc12345£";
        assertFalse(validationService.validatePassword(aPassword, aPassword, new HashMap<>()));
    }
}
