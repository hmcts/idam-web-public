package uk.gov.hmcts.reform.idam.web.model;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Setter
@Getter
public class VerificationRequest {

    @NotEmpty
    private String username;

    private String password;

    private String redirect_uri;

    private String state;

    private String response_type;

    private String client_id;

    private String scope;

    private boolean selfRegistrationEnabled;

    @NotEmpty
    private String code;
}
