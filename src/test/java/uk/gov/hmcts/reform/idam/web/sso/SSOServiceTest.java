package uk.gov.hmcts.reform.idam.web.sso;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class SSOServiceTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ConfigurationProperties configurationProperties;

    @InjectMocks
    private SSOService ssoService;

    @Test
    public void isSSOEmail_shouldBeCaseInsensitive() {
        final var ssoEmailDomains = Map.of("test.com", "provider");

        given(configurationProperties.getSsoEmailDomains())
            .willReturn(ssoEmailDomains);

        assertTrue(ssoService.isSSOEmail("test@test.com"));
        assertTrue(ssoService.isSSOEmail("test@TEST.COM"));
    }

    @Test
    public void redirectToExternalProvider() throws IOException {
        final HttpServletResponse res = Mockito.mock(HttpServletResponse.class);
        final HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        final HttpSession sess = Mockito.mock(HttpSession.class);

        given(sess.getAttribute("provider"))
            .willReturn("ejudiciary-aad");
        given(req.getSession(false))
            .willReturn(sess);
        given(req.getSession())
            .willReturn(sess);

        ssoService.redirectToExternalProvider(req, res);

        verify(res).sendRedirect("/oauth2/authorization/oidc");
    }

    @Test
    public void redirectToExternalProvider_withLoginEmail() throws IOException {
        final HttpServletResponse res = Mockito.mock(HttpServletResponse.class);
        final HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        final HttpSession sess = Mockito.mock(HttpSession.class);

        given(req.getSession(false))
            .willReturn(null);
        given(req.getSession())
            .willReturn(sess);

        final var ssoEmailDomains = Map.of("test.com", "ejudiciary-aad");
        given(configurationProperties.getSsoEmailDomains())
            .willReturn(ssoEmailDomains);

        ssoService.redirectToExternalProvider(req, res, "test@test.com");

        verify(res).sendRedirect("/oauth2/authorization/oidc");

    }

    @Test
    public void redirectToExternalProvider_withNoLoginEmail() throws IOException {
        final HttpServletResponse res = Mockito.mock(HttpServletResponse.class);
        final HttpServletRequest req = Mockito.mock(HttpServletRequest.class);
        final HttpSession sess = Mockito.mock(HttpSession.class);

        given(req.getSession(false))
            .willReturn(null);
        given(req.getSession())
            .willReturn(sess);

        final var ssoEmailDomains = Map.of("test.com", "ejudiciary-aad");
        given(configurationProperties.getSsoEmailDomains())
            .willReturn(ssoEmailDomains);

        given(req.getParameter("login_hint"))
            .willReturn("ejudiciary-aad");

        ssoService.redirectToExternalProvider(req, res);

        verify(res).sendRedirect("/oauth2/authorization/oidc");

    }
}