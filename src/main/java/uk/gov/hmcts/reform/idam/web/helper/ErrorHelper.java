package uk.gov.hmcts.reform.idam.web.helper;

import lombok.experimental.UtilityClass;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpStatusCodeException;

import javax.annotation.Nullable;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

@UtilityClass
public class ErrorHelper {

    private static final String ERROR_KEY = "error";
    private static final String ERROR_TITLE_KEY = "errorTitle";
    private static final String ERROR_MESSAGE_KEY = "errorMessage";
    private static final String REDIRECT_URI_KEY = "redirectUri";
    private static final String ERROR_LABEL_ONE_KEY = "errorLabelOne";
    private static final String ERROR_LABEL_TWO_KEY = "errorLabelTwo";

    public static void showLoginError(String errorTitle, String errorMessage, String redirectUri,
                                      Map<String, Object> model) {
        model.put(ERROR_KEY, ERROR_KEY);
        model.put(ERROR_TITLE_KEY, errorTitle);
        model.put(ERROR_MESSAGE_KEY, errorMessage);
        model.put(REDIRECT_URI_KEY, redirectUri);
    }

    public static void showError(String errorTitle, String errorMessage, String errorLabelOne, String errorLabelTwo,
                                 Map<String, Object> model) {
        model.put(ERROR_KEY, ERROR_KEY);
        model.put(ERROR_TITLE_KEY, errorTitle);
        model.put(ERROR_MESSAGE_KEY, errorMessage);
        model.put(ERROR_LABEL_ONE_KEY, errorLabelOne);
        model.put(ERROR_LABEL_TWO_KEY, errorLabelTwo);
    }

    public static void showError(String errorLabelOne, String errorLabelTwo, Map<String, Object> model) {
        model.put(ERROR_KEY, ERROR_KEY);
        model.put(ERROR_LABEL_ONE_KEY, errorLabelOne);
        model.put(ERROR_LABEL_TWO_KEY, errorLabelTwo);
    }

    public static HttpStatusCodeException restException(@Nullable String message,
                                                        HttpStatus status, HttpHeaders headers,
                                                        String error, String description) {
        return restException(message, status, headers, jsonErrorString(error, description).getBytes());
    }

    public static HttpStatusCodeException restException(
        @Nullable String message, HttpStatus status, HttpHeaders headers, byte[] body) {
        if (status.series() == HttpStatus.Series.CLIENT_ERROR) {
            return HttpClientErrorException.create(message, status, status.getReasonPhrase(), headers, body, UTF_8);
        }
        return HttpServerErrorException.create(message, status, status.getReasonPhrase(), headers, body, UTF_8);
    }

    public static String jsonErrorString(String error, String description) {
        return String.format("{%n \"error\": \"%s\",%n  \"description\": \"%s\"%n}", error, description);
    }
}
