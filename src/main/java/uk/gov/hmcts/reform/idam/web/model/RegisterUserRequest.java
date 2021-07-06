package uk.gov.hmcts.reform.idam.web.model;

import lombok.Data;
import uk.gov.hmcts.reform.idam.web.validation.Email;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

@Data
public class RegisterUserRequest {


    /**
     * The blacklisted characters from first name and last name fields.
     * If you modify any of these, please remember to update the equivalent messages.
     */
    private static final String BLACKLISTED_NAME_CHARACTERS = "\\*\\(\\)!/;:@#£\\$%=\\+";

    /**
     * Matches empty strings or strings longer than 1 character that don't include blacklisted characters nor digits.
     */
    public static final String NAME_REGEX_PATTERN = "^(|[^" + BLACKLISTED_NAME_CHARACTERS + "\\d]{2,})$";

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String firstName;

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String lastName;

    @Email
    private String username;

    @NotEmpty
    private String jwt;

    @NotEmpty
    private String redirect_uri;

    @NotEmpty
    private String client_id;

    private String state;

    private String nonce;
}