package uk.gov.hmcts.reform.idam.web.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

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

    private String code;

    @NotEmpty @Length(min = 6, max = 6) @Pattern(regexp = "\\d+")
    public String getCode() {
        return code != null ? code.trim() : null;
    }
}
