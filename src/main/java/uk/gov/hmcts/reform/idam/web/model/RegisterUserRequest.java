package uk.gov.hmcts.reform.idam.web.model;

import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegisterUserRequest extends AbstractRegisterRequest  {

    @NotEmpty
    private String jwt;

    public String getUsername() {
        return super.getEmail();
    }

    public void setUsername(String username) {
        super.setEmail(username);
    }
}