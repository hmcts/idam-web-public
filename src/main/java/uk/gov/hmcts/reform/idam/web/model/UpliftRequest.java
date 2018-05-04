package uk.gov.hmcts.reform.idam.web.model;

import org.hibernate.validator.constraints.NotEmpty;

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
    private String redirectUri;

    private String state;

    @NotEmpty
    private String clientId;
}
