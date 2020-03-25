package uk.gov.hmcts.reform.idam.web.helper;

import lombok.NonNull;
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
import java.util.Locale;
import java.util.Optional;

@UtilityClass
public class JSPHelper {

    private static final UrlPathHelper PATH_HELPER = new UrlPathHelper();
    private static MessageSource messageSource;

    @Nonnull
    public static String getOtherLocaleUrl() {
        final ServletRequestAttributes servletRequestAttributes = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes());
        final HttpServletRequest request = servletRequestAttributes != null ? servletRequestAttributes.getRequest() : null;
        final String targetLocale = getTargetLocale();

        if (request != null) {
            final String requestUri = PATH_HELPER.getOriginatingRequestUri(request);
            final String requestQueryString = PATH_HELPER.getOriginatingQueryString(request);
            final UriComponentsBuilder initialUrl = UriComponentsBuilder.fromPath(requestUri).replaceQuery(requestQueryString);

            return overrideLocaleParameter(initialUrl, targetLocale);
        }
        throw new IllegalStateException("No active request was found.");
    }

    public static String overrideLocaleParameter(@NonNull final UriComponentsBuilder builder, @NonNull final String targetLocale) {
        return builder.replaceQueryParam(MessagesConfiguration.UI_LOCALES_PARAM_NAME, new Locale(targetLocale)).toUriString();
    }

    @Nonnull
    public static String getTargetLocale() {
        if (JSPHelper.messageSource == null) {
            final MessageSource newMessageSource = Application.getContext().getBean(MessageSource.class);
            JSPHelper.messageSource = Optional.ofNullable(newMessageSource)
                .orElseThrow(() -> new IllegalStateException("No messages source is available"));
        }
        return JSPHelper.messageSource.getMessage("public.common.language.switch.locale", null, LocaleContextHolder.getLocale());
    }

}
