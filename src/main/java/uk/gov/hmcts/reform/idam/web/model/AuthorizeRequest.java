package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthorizeRequest {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    private String nonce;

    private String prompt;

    private String redirect_uri;

    private String state;

    private String response_type;

    private String client_id;

    private String scope;

    private boolean selfRegistrationEnabled;

    private String code;

    private boolean azureLoginEnabled;

    private boolean hasOtpCheckFailed;

    private boolean hasTooManyAttemptsOtp;
}
