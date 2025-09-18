package uk.gov.hmcts.reform.idam.web.security;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class CspNonceService {

    private static final int NONCE_LENGTH = 32;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateNonce() {
        byte[] nonceBytes = new byte[NONCE_LENGTH];
        secureRandom.nextBytes(nonceBytes);
        return Base64.getEncoder().encodeToString(nonceBytes);
    }
}
