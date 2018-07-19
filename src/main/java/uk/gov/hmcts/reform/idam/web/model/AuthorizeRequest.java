package uk.gov.hmcts.reform.idam.web.model;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthorizeRequest {
    @NotEmpty
    private String username;
    @NotEmpty
    private String password;
    private String redirect_uri;
    private String state;
    private String response_type;
    private String client_id;
    private boolean selfRegistrationEnabled;
}
