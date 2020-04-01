package uk.gov.hmcts.reform.idam.web.config;

import lombok.NonNull;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.net.URL;
import java.util.Arrays;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The OpenID Connect Locale Change Interceptor.
 */
public class OIDCLocaleChangeInterceptor extends LocaleChangeInterceptor {

    private static final String UI_LOCALE_PARAM_SEPARATOR = " ";

    protected final Set<Locale> supportedLocales;

    public OIDCLocaleChangeInterceptor() {
        super();
        this.supportedLocales = getSupportedLocales();
        this.supportedLocales.add(Locale.ENGLISH);
    }

    /**
     * Checks the defined parameter according to OIDC rules for {@code ui_locales}. See https://openid.net/specs/openid-connect-core-1_0.html.
     * {@inheritDoc}
     *
     * @should set locale to a single tag
     * @should accept no parameter
     * @should accept invalid locales
     * @should set locale to first matching language tag
     * @should handle invalid locales tag exception
     */
    @Override
    public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, Object handler) {

        final String localesTagsString = request.getParameter(getParamName());
        if (localesTagsString == null) return true;

        final String[] localesTags = localesTagsString.split(UI_LOCALE_PARAM_SEPARATOR);

        final LocaleResolver localeResolver = Optional.ofNullable(getLocaleResolver(request))
            .orElseThrow(() -> new IllegalStateException("No LocaleResolver found: not in a DispatcherServlet request?"));

        for (final String localesTag : localesTags) {
            try {
                final Locale locale = parseLocaleValue(localesTag);
                if (locale != null && supportedLocales.contains(locale)) {
                    localeResolver.setLocale(request, response, locale);
                    return true;
                }
            } catch (IllegalArgumentException ex) {
                handleException(localesTag, ex);
            }
        }

        // Proceed in any case.
        return true;
    }

    /**
     * @should throw if ignore invalid locale is true
     * @should not throw if ignore invalid locale is false
     */
    protected void handleException(String localesTag, @NonNull final IllegalArgumentException ex) {
        if (isIgnoreInvalidLocale()) {
            if (logger.isDebugEnabled()) {
                logger.debug("Ignoring invalid locale value [" + localesTag + "]: " + ex.getMessage());
            }
        } else {
            throw ex;
        }
    }

    @Nullable
    private LocaleResolver getLocaleResolver(@NotNull final HttpServletRequest request) {
        return RequestContextUtils.getLocaleResolver(request);
    }

    @Nonnull
    private Set<Locale> getSupportedLocales() {
        return Arrays.stream(Locale.getISOLanguages())
            .map(language -> {
                final URL systemResource = ClassLoader.getSystemResource("messages_" + language + ".properties");
                return systemResource == null ? null : parseLocaleValue(language);
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
    }
}
