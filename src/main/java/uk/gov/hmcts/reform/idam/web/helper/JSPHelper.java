package uk.gov.hmcts.reform.idam.web.helper;

import lombok.experimental.UtilityClass;
import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.net.URLCodec;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UrlPathHelper;
import uk.gov.hmcts.reform.idam.web.Application;
import uk.gov.hmcts.reform.idam.web.config.IdamWebMvcConfiguration;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;
import java.util.Optional;

@UtilityClass
public class JSPHelper {

    private static boolean googleTagManager;
    private static final URLCodec URL_CODEC = new URLCodec();
    private static MessageSource messageSource;
    private final UrlPathHelper pathHelper = new UrlPathHelper();

    /**
     * @should return correct url for English
     * @should return correct url for Welsh
     * @should throw if there is no request in context
     */
    @NotNull
    public String getOtherLocaleUrl() throws DecoderException {
        final ServletRequestAttributes servletRequestAttributes = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes());
        final HttpServletRequest request = servletRequestAttributes != null ? servletRequestAttributes.getRequest() : null;
        final String targetLocale = getTargetLocale();


        if (request != null) {
            final String requestUri = pathHelper.getOriginatingRequestUri(request);
            final String originatingQueryString = pathHelper.getOriginatingQueryString(request);
            final String requestQueryString = originatingQueryString == null ? null : URL_CODEC.decode(originatingQueryString); //NOSONAR
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
     * @should throw on any of the parameters being null
     */
    public static String overrideLocaleParameter(@NotNull final UriComponentsBuilder builder, @NotNull final String targetLocale) {
        return builder.replaceQueryParam(IdamWebMvcConfiguration.UI_LOCALES_PARAM_NAME, new Locale(targetLocale)).toUriString();
    }

    /**
     * @should return en if current locale is welsh
     * @should return cy if current locale is english
     */
    @NotNull
    public static String getTargetLocale() {
        if (JSPHelper.messageSource == null) {
            final MessageSource newMessageSource = Application.getContext().getBean(MessageSource.class);
            JSPHelper.messageSource = Optional.ofNullable(newMessageSource)
                .orElseThrow(() -> new IllegalStateException("No messages source is available"));
        }
        return JSPHelper.messageSource.getMessage("public.common.language.switch.locale", null, getCurrentLocale());
    }

    public static Locale getCurrentLocale() {
        return LocaleContextHolder.getLocale();
    }

    public static void setGTMEnabled(boolean enabled) {
        googleTagManager = enabled;
    }

    public static boolean isGTMEnabled() {
        return googleTagManager;
    }
}
