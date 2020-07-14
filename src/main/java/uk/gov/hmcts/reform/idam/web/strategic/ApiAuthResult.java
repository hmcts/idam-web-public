package uk.gov.hmcts.reform.idam.web.strategic;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;

import java.util.List;

@Data
@Builder
public class ApiAuthResult {

    private List<String> cookies;
    private EvaluatePoliciesAction policiesAction;
    private HttpStatus httpStatus;
    private ErrorResponse.CodeEnum errorCode;

    public boolean isSuccess() {
        return (httpStatus == HttpStatus.OK || httpStatus == HttpStatus.FOUND) &&
            errorCode == null && policiesAction != EvaluatePoliciesAction.BLOCK;
    }

    public boolean requiresMfa() {
        return policiesAction == EvaluatePoliciesAction.MFA_REQUIRED;
    }
}
