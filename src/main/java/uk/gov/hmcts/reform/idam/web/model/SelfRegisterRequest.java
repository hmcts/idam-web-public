package uk.gov.hmcts.reform.idam.web.model;

import lombok.Data;
import uk.gov.hmcts.reform.idam.web.validation.Email;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import static uk.gov.hmcts.reform.idam.web.model.RegisterUserRequest.NAME_REGEX_PATTERN;

@Data
public class SelfRegisterRequest  {

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String firstName;

    @NotEmpty
    @Pattern(regexp = NAME_REGEX_PATTERN)
    private String lastName;

    @Email
    private String email;

    private String redirectUri;

    private String clientId;

    private String state;

}
