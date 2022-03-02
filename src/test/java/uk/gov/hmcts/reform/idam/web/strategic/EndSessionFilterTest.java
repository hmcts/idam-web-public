package uk.gov.hmcts.reform.idam.web.strategic;

import com.google.common.net.HttpHeaders;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;

import javax.servlet.http.HttpSession;
import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.POST_TYPE;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.SEND_RESPONSE_FILTER_ORDER;

@RunWith(MockitoJUnitRunner.class)
public class EndSessionFilterTest {

    private EndSessionFilter underTest;

    @Mock
    private MockHttpServletRequest httpRequest;

    @Mock
    private MockHttpServletResponse httpResponse;

    @Mock
    private RequestContext mockContext;

    @Mock
    private HttpSession httpSession;

    private StrategicConfigurationProperties.Session sessionConfiguration;

    @Before
    public void setUp() {
        final ConfigurationProperties config = new ConfigurationProperties();
        final StrategicConfigurationProperties strategicProperties = new StrategicConfigurationProperties();

        sessionConfiguration = new StrategicConfigurationProperties.Session();
        sessionConfiguration.setIdamSessionCookie("Idam.Session");
        strategicProperties.setSession(sessionConfiguration);
        config.setStrategic(strategicProperties);

        this.underTest = spy(new EndSessionFilter(config));

        when(mockContext.getRequest()).thenReturn(httpRequest);
        when(mockContext.getResponse()).thenReturn(httpResponse);
        when(httpRequest.getSession(false)).thenReturn(httpSession);
        RequestContext.testSetCurrentContext(mockContext);
    }

    @Test
    public void filterType() {
        assertEquals(POST_TYPE, underTest.filterType());
    }

    @Test
    public void filterOrder() {
        assertTrue(underTest.filterOrder() < SEND_RESPONSE_FILTER_ORDER);
        assertTrue(underTest.filterOrder() > 0);
    }

    @Test
    public void shouldFilterEndSessionRequests() {
        given(httpRequest.getRequestURI()).willReturn("https://hmcts-access.service.gov.uk/o/endSession");
        assertTrue(underTest.shouldFilter());
    }

    @Test
    public void shouldFilterOtherRequests() {
        given(httpRequest.getRequestURI()).willReturn("https://hmcts-access.service.gov.uk/o/userinfo");
        assertFalse(underTest.shouldFilter());
    }

    @Test
    public void run() throws IOException, ZuulException {
        underTest.run();
        verify(httpSession).invalidate();
        verify(httpResponse).addHeader(eq(HttpHeaders.SET_COOKIE), contains(sessionConfiguration.getIdamSessionCookie()));
    }
}
