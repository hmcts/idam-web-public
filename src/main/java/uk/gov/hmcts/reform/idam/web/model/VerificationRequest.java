package uk.gov.hmcts.reform.idam.web.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class VerificationRequest {
    private String code;
    private String username;
    private String response_type;
    private String state;
    private String client_id;
    private String redirect_uri;
    private String scope;
    private boolean selfRegistrationEnabled;
}
