package uk.gov.hmcts.reform.idam.web.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.hmcts.reform.idam.web.validation.Email;

@Data
@EqualsAndHashCode(callSuper = true)
public class SelfRegisterRequest  extends AbstractRegisterRequest {
    @Email
    private String email;

    private String redirectUri;

    private String clientId;
}
