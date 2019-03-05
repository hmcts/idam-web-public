package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.hmcts.reform.idam.web.validation.Email;

/**
 * @author Ivano
 */
@Data
@EqualsAndHashCode
public class RegisterUserRequest {

    @NotEmpty
    private String firstName;

    @NotEmpty
    private String lastName;

    @Email
    private String username;

    @NotEmpty
    private String jwt;

    @NotEmpty
    private String redirect_uri;

    @NotEmpty
    private String client_id;

    private String state;
}