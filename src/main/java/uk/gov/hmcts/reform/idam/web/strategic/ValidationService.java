package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.web.helper.ErrorHelper;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Component
public class ValidationService {
    
    private final ObjectMapper mapper;

    private final int passwordMinLength;

    private final int passwordMaxLength;

    @Autowired
    public ValidationService(
        @Value("${validation.password.minLength:8}") int passwordMinLength,
        @Value("${validation.password.maxLength:256}") int passwordMaxLengths,
        ObjectMapper mapper) {
        this.passwordMinLength = passwordMinLength;
        this.passwordMaxLength = passwordMaxLengths;
        this.mapper = mapper;
    }

    /**
     * @should return false if the passwords is null or empty
     * @should return false if the passwords don't match
     * @should return false if the password does not comply with the length requirement
     * @should return false if the password contains illegal characters
     * @should return false if both passwords are null or empty
     * @should return true if both passwords are present and comply with the length requirement and are equal
     */
    public boolean validatePassword(final String password1, final String password2, Map<String, Object> model) {

        String errorForPassword1 = "";
        String errorForPassword2 = "";

        // check password 1
        if (StringUtils.isEmpty(password1)) {
            errorForPassword1 = "public.common.error.enter.password";
        } else if (password1.length() < passwordMinLength || password1.length() > passwordMaxLength || containsIllegalCharacters(password1)) {
            errorForPassword1 = "public.common.error.password.details";
        }

        // check password 2
        if (StringUtils.isEmpty(password2)) {
            errorForPassword2 = "public.common.error.enter.password";
        } else if (!password2.equals(password1)) {
            errorForPassword2 = "public.common.error.password.should.match";
        }

        final boolean password1HasErrors = !errorForPassword1.isEmpty();
        final boolean password2HasErrors = !errorForPassword2.isEmpty();

        if (password1HasErrors || password2HasErrors) {
            if (!password1HasErrors) {
                model.put("password1", password1);
            }
            if (!password2HasErrors) {
                model.put("password2", password2);
            }
            ErrorHelper.showError(errorForPassword1, errorForPassword2, model);
            return false;
        }
        return true;
    }

    private boolean containsIllegalCharacters(@NotNull String password) {
        for (char c : password.toCharArray()) {
            if ((c <= '\u001f' && c != '\t') || c >= '\u007f') {
                return true;
            }
        }
        return false;
    }

    /**
     * @should return false if error code is not present in response body
     * @should return true if error code is present in response body
     */
    public boolean isErrorInResponse(String responseBody, ErrorResponse.CodeEnum errorCode) throws IOException {
        if (!Strings.isNullOrEmpty(responseBody)) {
            ErrorResponse error = mapper.readValue(responseBody, ErrorResponse.class);
            if (Objects.nonNull(error) && Objects.nonNull(error.getCode()) && error.getCode().equals(errorCode)) {
                return true;
            }
        }
        return false;
    }
}
