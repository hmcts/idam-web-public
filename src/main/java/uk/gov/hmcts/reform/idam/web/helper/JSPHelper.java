package uk.gov.hmcts.reform.idam.web.helper;

import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.experimental.UtilityClass;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UrlPathHelper;
import uk.gov.hmcts.reform.idam.web.Application;
import uk.gov.hmcts.reform.idam.web.config.MessagesConfiguration;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Locale;
import java.util.Optional;

@UtilityClass
public class JSPHelper {

    private static final UrlPathHelper PATH_HELPER = new UrlPathHelper();
    private static MessageSource messageSource;

    /**
     * @should return correct url for English
     * @should return correct url for Welsh
     * @should throw if there is no request in context
     */
    @Nonnull
    @SneakyThrows(UnsupportedEncodingException.class)
    public String getOtherLocaleUrl() {
        final ServletRequestAttributes servletRequestAttributes = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes());
        final HttpServletRequest request = servletRequestAttributes != null ? servletRequestAttributes.getRequest() : null;
        final String targetLocale = getTargetLocale();

        if (request != null) {
            final String requestUri = PATH_HELPER.getOriginatingRequestUri(request);
            final String originatingQueryString = PATH_HELPER.getOriginatingQueryString(request);
            final String requestQueryString = originatingQueryString == null ? null : URLDecoder.decode(originatingQueryString, "UTF-8"); //NOSONAR
            final UriComponentsBuilder initialUrl = UriComponentsBuilder.fromPath(requestUri).replaceQuery(requestQueryString);

            return overrideLocaleParameter(initialUrl, targetLocale);
        }
        throw new IllegalStateException("No active request was found.");
    }

    /**
     * @param builder the URI builder
     * @param targetLocale the target locale
     *
     * @should override existing parameter
     * @should add nonexisting parameter
     */
    public static String overrideLocaleParameter(@NonNull final UriComponentsBuilder builder, @NonNull final String targetLocale) {

        return builder.replaceQueryParam(MessagesConfiguration.UI_LOCALES_PARAM_NAME, new Locale(targetLocale)).toUriString();
    }

    /**
     * @should return en if current locale is welsh
     * @should return cy if current locale is english
     */
    @Nonnull
    public static String getTargetLocale() {
        if (JSPHelper.messageSource == null) {
            final MessageSource newMessageSource = Application.getContext().getBean(MessageSource.class);
            JSPHelper.messageSource = Optional.ofNullable(newMessageSource)
                .orElseThrow(() -> new IllegalStateException("No messages source is available"));
        }
        return JSPHelper.messageSource.getMessage("public.common.language.switch.locale", null, getCurrentLocale());
    }

    private static Locale getCurrentLocale() {
        return LocaleContextHolder.getLocale();
    }

}
