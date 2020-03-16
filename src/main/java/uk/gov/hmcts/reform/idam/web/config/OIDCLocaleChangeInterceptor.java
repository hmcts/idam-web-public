package uk.gov.hmcts.reform.idam.web.config;

import com.google.common.collect.ImmutableSet;
import lombok.NonNull;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.support.RequestContextUtils;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.util.Locale;
import java.util.Set;

public class OIDCLocaleChangeInterceptor extends LocaleChangeInterceptor {

    protected final Set<Locale> allowedLocales;

    public OIDCLocaleChangeInterceptor(@NonNull final Set<Locale> allowedLocales) {
        super();
        this.allowedLocales = ImmutableSet.copyOf(allowedLocales);
    }

    /**
     * Checks the defined parameter according to OIDC rules for {@code ui_locales}. See https://openid.net/specs/openid-connect-core-1_0.html.
     * {@inheritDoc}
     *
     * @should set locale to a single tag
     * @should accept no parameter
     * @should accept invalid locales
     * @should set locale to first matching language tag
     */
    @Override
    public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, Object handler) {

        final String localesTagsString = request.getParameter(getParamName());

        if (localesTagsString != null) {
            final String[] localesTags = localesTagsString.split(" ");
            final String requestMethod = request.getMethod().toLowerCase();

            if ("post".equals(requestMethod) || "get".equals(requestMethod)) {
                final LocaleResolver localeResolver = getLocaleResolver(request);
                if (localeResolver == null) {
                    throw new IllegalStateException(
                        "No LocaleResolver found: not in a DispatcherServlet request?");
                }
                for (final String localesTag : localesTags) {
                    try {
                        final Locale locale = parseLocaleValue(localesTag);
                        if (locale != null && allowedLocales.contains(locale)) {
                            localeResolver.setLocale(request, response, locale);
                            return true;
                        }
                    } catch (IllegalArgumentException ex) {
                        if (isIgnoreInvalidLocale()) {
                            if (logger.isDebugEnabled()) {
                                logger.debug("Ignoring invalid locale value [" + localesTag + "]: " + ex.getMessage());
                            }
                        } else {
                            throw ex;
                        }
                    }
                }
            }
        }

        // Proceed in any case.
        return true;
    }

    @Nullable
    private LocaleResolver getLocaleResolver(@NotNull final HttpServletRequest request) {
        return RequestContextUtils.getLocaleResolver(request);
    }
}
