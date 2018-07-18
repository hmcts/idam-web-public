package uk.gov.hmcts.reform.idam.web.validation;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author Ivano
 */
class EmailValidator implements ConstraintValidator<Email, String> {

    private static final String AT_LEAST_ONE_ALLOWED_CHARACTER = "[^()&!%;*/@\\s]+";
    private static final String EMAIL_REGEX =
        "^"
            + AT_LEAST_ONE_ALLOWED_CHARACTER
            + "@(" + AT_LEAST_ONE_ALLOWED_CHARACTER + "\\." + AT_LEAST_ONE_ALLOWED_CHARACTER + ")+" +
            "$";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public EmailValidator() {
    }

    @Override public void initialize(Email constraint) {
    }

    /**
     * @should return true for a valid email address
     * @should return false if the email address is empty
     * @should return false if the email address does not contain a dot
     * @should return false if the email address ends with a dot
     * @should return false if the email address does not match the pattern
     */
    @Override public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return false;
        } else if (email.endsWith(".")) {
            return false;
        } else {
            Matcher emailMatcher = EMAIL_PATTERN.matcher(email);
            return emailMatcher.matches();
        }
    }

}
