package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import uk.gov.hmcts.reform.idam.web.validation.Email;

/**
 * @author Ivano
 */
@Getter
@Setter
@EqualsAndHashCode
public class UpliftRequest {

    @Email
    private String username;

    @NotEmpty
    private String password;

    @NotEmpty
    private String jwt;

    @NotEmpty
    private String redirect_uri;

    private String state;

    private String scope;

    @NotEmpty
    private String client_id;
}
