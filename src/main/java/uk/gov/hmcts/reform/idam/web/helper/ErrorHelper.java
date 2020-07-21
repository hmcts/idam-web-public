package uk.gov.hmcts.reform.idam.web.helper;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.HttpStatusCodeException;

import javax.annotation.Nullable;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ErrorHelper {

    private static final String ERROR = "error";
    private static final String ERROR_TITLE = "errorTitle";
    private static final String ERROR_MESSAGE = "errorMessage";
    private static final String REDIRECT_URI = "redirectUri";
    private static final String ERROR_LABEL_ONE = "errorLabelOne";
    private static final String ERROR_LABEL_TWO = "errorLabelTwo";

    public static void showLoginError(String errorTitle, String errorMessage, String redirectUri,
                                      Map<String, Object> model) {
        model.put(ERROR, ERROR);
        model.put(ERROR_TITLE, errorTitle);
        model.put(ERROR_MESSAGE, errorMessage);
        model.put(REDIRECT_URI, redirectUri);
    }

    public static void showError(String errorTitle, String errorMessage, String errorLabelOne, String errorLabelTwo,
                                 Map<String, Object> model) {
        model.put(ERROR, ERROR);
        model.put(ERROR_TITLE, errorTitle);
        model.put(ERROR_MESSAGE, errorMessage);
        model.put(ERROR_LABEL_ONE, errorLabelOne);
        model.put(ERROR_LABEL_TWO, errorLabelTwo);
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
        return "{\n" +
            "  \"error\": \"errorString\",\n" +
            "  \"description\": \"errorDescription\"\n" +
            "}";
    }
}
