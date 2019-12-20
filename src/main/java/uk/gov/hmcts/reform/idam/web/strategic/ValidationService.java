package uk.gov.hmcts.reform.idam.web.strategic;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.idam.api.internal.model.ErrorResponse;
import uk.gov.hmcts.reform.idam.web.helper.ErrorHelper;

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

        if (StringUtils.isEmpty(password1) && StringUtils.isEmpty(password2)) {
            ErrorHelper.showError("Error", "public.common.error.password.not.empty", "public.common.error.enter.password", "public.common.error.enter.password", model);
            return false;
        }
        if (StringUtils.isEmpty(password1)) {
            ErrorHelper.showError("Error", "public.common.error.password.not.empty", "public.common.error.enter.password", "", model);
            model.put("password2", password2);
            return false;
        }
        if (StringUtils.isEmpty(password2)) {
            ErrorHelper.showError("Error", "public.common.error.password.not.empty", "", "public.common.error.enter.password", model);
            model.put("password1", password1);
            return false;
        }

        if (!password1.equals(password2)) {
            ErrorHelper.showError("Error", "public.common.error.password.not.same", "", "public.common.error.password.should.match", model);
            model.put("password1", password1);
            return false;
        }

        if (password1.length() < passwordMinLength || password1.length() > passwordMaxLength) {
            ErrorHelper.showError("Error", "public.common.error.invalid.password", "public.common.error.password.details", "", model);
            model.put("password1", password1);
            return false;
        }

        if (containsIllegalCharacters(password1)) {
            ErrorHelper.showError("Error", "public.common.error.invalid.password.illegal-characters", "public.common.error.password.details", "", model);
            model.put("password1", password1);
            return false;
        }

        return true;
    }

    private boolean containsIllegalCharacters(String password) {
        for (int i = 0, length = password.length(); i < length; i++) {
            char c = password.charAt(i);
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
