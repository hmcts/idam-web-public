package uk.gov.hmcts.reform.idam.web.security;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.junit.Test;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
public class CspNonceServiceTest {

    private CspNonceService cspNonceService;

    @Before
    public void setUp() {
        cspNonceService = new CspNonceService();
    }

    @Test
    public void generateNonce_shouldReturnValue() {
        String nonce = cspNonceService.generateNonce();
        assertNotNull(nonce, "Nonce should not be null");
        assertFalse(nonce.isEmpty(), "Nonce should not be empty");
        assertTrue(nonce.length() > 0, "Nonce should have length greater than 0");
    }

    @Test
    public void generateNonce_shouldReturnValidBase64String() {
        String nonce = cspNonceService.generateNonce();
        assertDoesNotThrow(() -> {
            Base64.getDecoder().decode(nonce);
        }, "Nonce should be a valid Base64 encoded string");
    }

    @Test
    public void generateNonce_shouldReturnUniqueValues() {
        Set<String> nonces = new HashSet<>();

        for (int i = 0; i < 100; i++) {
            String nonce = cspNonceService.generateNonce();
            nonces.add(nonce);
        }

        assertEquals(100, nonces.size(), "All generated nonces should be unique");
    }
}
