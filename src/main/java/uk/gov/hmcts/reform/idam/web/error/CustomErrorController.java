package uk.gov.hmcts.reform.idam.web.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@Slf4j
public class CustomErrorController implements ErrorController {

    public static final String ERROR_VIEW = "error";

    @RequestMapping(path = "/error", method = {RequestMethod.GET, RequestMethod.POST}) //NOSONAR
    public String error(HttpServletRequest request, HttpServletResponse response) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        if (status != null && exception != null) {
            int statusCode = Integer.parseInt(status.toString());
            log.info("Status " + statusCode + " error redirect.", (Throwable) exception);
            if(statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()
                && exception instanceof IOException) {
                response.setStatus(200);
            }
        }

        return ERROR_VIEW;
    }
}
