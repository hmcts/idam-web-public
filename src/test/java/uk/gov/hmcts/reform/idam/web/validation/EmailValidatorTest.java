package uk.gov.hmcts.reform.idam.web.validation;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmailValidatorTest {

    private EmailValidator emailValidator;

    @BeforeEach
    public void setUp() {
        emailValidator = new EmailValidator();
    }

    /**
     * @verifies return true for a valid email address
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnTrueForAValidEmailAddress() throws Exception {
        String validEmail = "john.doe@test.com";
        Assertions.assertTrue(emailValidator.isValid(validEmail, null));
    }

    /**
     * @verifies return false if the email address contains spaces
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressContainsSpaces() throws Exception {
        String invalidEmail = "john doe@test.com";
        Assertions.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address is empty
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressIsEmpty() throws Exception {
        String emptyEmail = "";
        Assertions.assertFalse(emailValidator.isValid(emptyEmail, null));
    }

    /**
     * @verifies return false if the email address does not contain a dot
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressDoesNotContainADot() throws Exception {
        String invalidEmail = "john@testcom";
        Assertions.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address ends with a dot
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressEndsWithADot() throws Exception {
        String invalidEmail = "john.doe@test.";
        Assertions.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address does not match the pattern
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressDoesNotMatchThePattern() throws Exception {
        String invalidEmail = "johndoetest";
        Assertions.assertFalse(emailValidator.isValid(invalidEmail, null));
    }
}
