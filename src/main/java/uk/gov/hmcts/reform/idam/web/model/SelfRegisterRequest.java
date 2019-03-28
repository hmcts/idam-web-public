package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.hmcts.reform.idam.web.validation.Email;

@Data
@EqualsAndHashCode
public class SelfRegisterRequest {

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @Email
    private String email;

    private String redirectUri;

    private String clientId;

    private String state;

}
