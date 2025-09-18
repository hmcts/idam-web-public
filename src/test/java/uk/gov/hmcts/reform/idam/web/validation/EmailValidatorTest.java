package uk.gov.hmcts.reform.idam.web.validation;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class EmailValidatorTest {

    private EmailValidator emailValidator;

    @Before
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
        Assert.assertTrue(emailValidator.isValid(validEmail, null));
    }

    /**
     * @verifies return false if the email address contains spaces
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressContainsSpaces() throws Exception {
        String invalidEmail = "john doe@test.com";
        Assert.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address is empty
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressIsEmpty() throws Exception {
        String emptyEmail = "";
        Assert.assertFalse(emailValidator.isValid(emptyEmail, null));
    }

    /**
     * @verifies return false if the email address does not contain a dot
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressDoesNotContainADot() throws Exception {
        String invalidEmail = "john@testcom";
        Assert.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address ends with a dot
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressEndsWithADot() throws Exception {
        String invalidEmail = "john.doe@test.";
        Assert.assertFalse(emailValidator.isValid(invalidEmail, null));
    }

    /**
     * @verifies return false if the email address does not match the pattern
     * @see EmailValidator#isValid(String, javax.validation.ConstraintValidatorContext)
     */
    @Test
    public void isValid_shouldReturnFalseIfTheEmailAddressDoesNotMatchThePattern() throws Exception {
        String invalidEmail = "johndoetest";
        Assert.assertFalse(emailValidator.isValid(invalidEmail, null));
    }
}
