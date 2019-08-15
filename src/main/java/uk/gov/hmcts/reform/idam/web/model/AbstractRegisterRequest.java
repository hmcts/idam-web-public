package uk.gov.hmcts.reform.idam.web.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.hmcts.reform.idam.web.validation.Email;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

@Data
@EqualsAndHashCode
abstract class AbstractRegisterRequest {

    /**
     * The blacklisted characters from first name and last name fields.
     * If you modify any of these, please remember to update the equivalent messages.
     */
    private static final String BLACKLISTED_CHARACTERS = "\\*\\(\\)!/;:@#£\\$%=\\+";

    /**
     * Matches empty strings or strings longer than 1 character that don't include blacklisted characters nor digits.
     */
    private static final String NAME_REGEX_PATTERN = "^(|[^" + BLACKLISTED_CHARACTERS + "\\d]{2,})$";

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String firstName;

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String lastName;

    private String state;
}
