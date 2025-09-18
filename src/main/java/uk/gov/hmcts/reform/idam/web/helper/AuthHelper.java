package uk.gov.hmcts.reform.idam.web.helper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthHelper {

    private final boolean useSecureCookie;

    public AuthHelper(@Value("${authentication.secureCookie}") boolean useSecureCookie) {
        this.useSecureCookie = useSecureCookie;
    }

    public List<String> makeCookiesSecure(List<String> cookies) {
        return cookies.stream()
            .map(cookie -> {
                String cookieFlags = "; Path=/";

                if (useSecureCookie && !cookie.contains("Secure")) {
                    cookieFlags += "; Secure";
                }

                if (!cookie.contains("HttpOnly")) {
                    cookieFlags += "; HttpOnly";
                }

                return cookie + cookieFlags;
            }).collect(Collectors.toList());
    }
}
