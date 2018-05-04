package uk.gov.hmcts.reform.idam.web.helper;

import java.util.Map;

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
}
