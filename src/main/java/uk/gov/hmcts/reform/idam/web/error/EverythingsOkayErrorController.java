package uk.gov.hmcts.reform.idam.web.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@Slf4j
public class EverythingsOkayErrorController implements ErrorController {

    public static final String ERROR_VIEW = "error";

    @RequestMapping("/error")
    public String error(HttpServletRequest request, HttpServletResponse response) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                response.setStatus(200);
                if (exception != null) {
                    log.info("Status 500 error redirect.", (Throwable) exception);
                }
            }
        }

        return ERROR_VIEW;
    }
}
