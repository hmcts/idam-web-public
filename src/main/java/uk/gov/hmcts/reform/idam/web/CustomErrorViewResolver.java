package uk.gov.hmcts.reform.idam.web;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.ErrorViewResolver;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Ivano
 */
@Component
public class CustomErrorViewResolver implements ErrorViewResolver {

    /**
     * model contains:
     * timestamp (Date)   : date and time of error
     * status    (Integer): HTTP status code
     * error     (String) : Error title
     * exception (String) : Class of the exception
     * message   (String) : Error message
     * path      (String) : current path
     */
    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {

        if (status == HttpStatus.NOT_FOUND) {
            return new ModelAndView("404");
        }

        ModelAndView view = new ModelAndView("errorpage");
        view.addObject("errorMsg", "public.error.page.generic.error");

        return view;
    }
}
