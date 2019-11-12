package uk.gov.hmcts.reform.idam.web.model;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

@Setter
@Getter
public class VerificationRequest {

    private String redirect_uri;

    private String state;

    private String response_type;

    private String client_id;

    private String scope;

    @NotEmpty
    @Pattern(regexp = "\\d+")
    @Length(min = 8, max = 8)
    private String code;

    public void setCode(String code) {
        this.code = code != null ? code.trim() : null;
    }

}
