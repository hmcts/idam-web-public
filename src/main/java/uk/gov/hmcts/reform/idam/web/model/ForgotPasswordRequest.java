package uk.gov.hmcts.reform.idam.web.model;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Getter;
import lombok.Setter;
import uk.gov.hmcts.reform.idam.web.validation.Email;

@Getter
@Setter
public class ForgotPasswordRequest {

    @NotEmpty
    @Email
    private String email;

    private String redirectUri;

    private String clientId;
}
