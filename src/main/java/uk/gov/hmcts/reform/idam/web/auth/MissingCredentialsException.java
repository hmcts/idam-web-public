package uk.gov.hmcts.reform.idam.web.auth;

import org.springframework.security.core.AuthenticationException;

/**
 * Thrown if an authentication request is rejected because the credentials were not provided invalid.
 * For this exception to be thrown, it means either the username or the password are missing.
 *
 * @author Ivano
 */
public class MissingCredentialsException extends AuthenticationException {

    /**
     * Constructs a <code>MissingCredentialsException</code> with the specified message.
     *
     * @param msg the detail message
     */
    public MissingCredentialsException(String msg) {
        super(msg);
    }

    /**
     * Constructs a <code>MissingCredentialsException</code> with the specified message and
     * root cause.
     *
     * @param msg the detail message
     * @param t   root cause
     */
    public MissingCredentialsException(String msg, Throwable t) {
        super(msg, t);
    }
}
