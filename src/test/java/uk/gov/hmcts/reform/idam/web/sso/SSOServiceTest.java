package uk.gov.hmcts.reform.idam.web.sso;

import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

public class SSOServiceTest {

    @Test
    public void isSSOEmail_shouldBeCaseInsensitive() {
        final var ssoService = spy(SSOService.class);
        final var ssoEmailDomains = Map.of("test.com", "provider");
        doReturn(ssoEmailDomains).when(ssoService).getSsoEmailDomains();

        assertTrue(ssoService.isSSOEmail("test@test.com"));
        assertTrue(ssoService.isSSOEmail("test@TEST.COM"));
    }
}