package uk.gov.hmcts.reform.idam.web;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.ResourceProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.DefaultErrorViewResolver;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Ivano
 */
@Component
public class CustomErrorViewResolver extends DefaultErrorViewResolver {

    /**
     * Create a new {@link DefaultErrorViewResolver} instance.
     *
     * @param applicationContext the source application context
     * @param resourceProperties resource properties
     */
    public CustomErrorViewResolver(ApplicationContext applicationContext, ResourceProperties resourceProperties) {
        super(applicationContext, resourceProperties);
    }

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

        ModelAndView view = super.resolveErrorView(request, status, model);

        if (view == null) {
            view = new ModelAndView("errorpage");
            view.addObject("errorMsg", "public.error.page.generic.error");
            view.addObject("errorSubMsg", "public.error.page.generic.sub.error");
        }

        return view;
    }
}
