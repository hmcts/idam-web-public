package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.hmcts.reform.idam.web.validation.Email;

@Data
@EqualsAndHashCode
public class SelfRegisterRequest {

    /**
     * The blacklisted characters from first name and last name fields.
     * If you modify any of these, please remember to update the equivalent messages.
     */
    private static final String BLACKLISTED_CHARACTERS = "\\*\\(\\)!/;:@#£\\$%=\\+";

    @Size(min = 2)
    @Pattern(regexp = "^[^" + BLACKLISTED_CHARACTERS + "]*$")
    private String firstName;

    @Size(min = 2)
    @Pattern(regexp = "^[^" + BLACKLISTED_CHARACTERS + "]*$")
    private String lastName;

    @Email
    private String email;

    private String redirectUri;

    private String clientId;

    private String state;

}
