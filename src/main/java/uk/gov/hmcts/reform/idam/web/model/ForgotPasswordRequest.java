package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

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

    private String client_id;

    private String state;

    private String scope;

    private String nonce;
}
