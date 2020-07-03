package uk.gov.hmcts.reform.idam.web.strategic;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ApiAuthResult {

    private List<String> headers;
    private PolicyService.EvaluatePoliciesAction policiesAction;
    private boolean requiresMfa;
    private HttpStatus httpStatus;

    public boolean isSuccess() {
        return httpStatus == HttpStatus.OK;
    }
}
