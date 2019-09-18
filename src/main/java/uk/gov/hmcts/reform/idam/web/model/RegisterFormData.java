package uk.gov.hmcts.reform.idam.web.model;

import lombok.Data;

@Data
public class RegisterFormData {
    private final String firstName;
    private final String lastName;
    private final String email;
}
