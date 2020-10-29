package uk.gov.hmcts.reform.idam.web.strategic;

import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.FeaturesConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.sso.SSOZuulFilter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

@RunWith(JUnitParamsRunner.class)
public class StepUpAuthenticationZuulFilterTest {

    private StepUpAuthenticationZuulFilter filter;
    private FeaturesConfigurationProperties featuresProperties;

    @Before
    public void setUp() {
        final ConfigurationProperties config = new ConfigurationProperties();
        final StrategicConfigurationProperties strategicProperties = new StrategicConfigurationProperties();
        final StrategicConfigurationProperties.Session session = new StrategicConfigurationProperties.Session();
        this.featuresProperties = spy(new FeaturesConfigurationProperties());
        featuresProperties.setStepUpAuthentication(true);
        config.setFeatures(featuresProperties);
        session.setIdamSessionCookie("Idam.Session");
        strategicProperties.setSession(session);
        config.setStrategic(strategicProperties);
        this.filter = spy(new StepUpAuthenticationZuulFilter(config, null));
    }

    @Test
    public void filterType() {
        assertEquals(PRE_TYPE, filter.filterType());
    }

    @Test
    public void filterOrder() {
        assertTrue(filter.filterOrder() > SSOZuulFilter.FILTER_ORDER);
    }

    @Test
    public void shouldFilter() {
        doReturn(true).when(filter).isAuthorizeRequest(any());
        doReturn(true).when(filter).hasSessionCookie(any());

        filter.shouldFilter();

        verify(filter, times(1)).isAuthorizeRequest(any());
        verify(filter, times(1)).hasSessionCookie(any());
    }

    private Object isAuthorizeRequestParams() {
        return new Object[]{
            new Object[]{"http://localhost:1234/o/authorize", "POST", true},
            new Object[]{"http://localhost:1234/o/authorize", "GET", true},
            new Object[]{"http://localhost:1234/o/authorize", "PUT", false},
            new Object[]{"http://localhost:1234/login?param=1", "POST", false},
            new Object[]{"http://localhost:1234/login?param=1", "GET", false},
        };
    }

    @Test
    @Parameters(method = "isAuthorizeRequestParams")
    public void isAuthorizeRequest(String requestUrl, String httpMethod, Boolean expectedResult) {
        final HttpServletRequest request = mock(HttpServletRequest.class);
        doReturn(requestUrl).when(request).getRequestURI();
        doReturn(httpMethod).when(request).getMethod();
        assertEquals(expectedResult, filter.isAuthorizeRequest(request));
    }


    @Test
    public void hasSessionCookie() {
        final HttpServletRequest request = mock(HttpServletRequest.class);

        doReturn(new Cookie[]{}).when(request).getCookies();
        assertFalse(filter.hasSessionCookie(request));

        Cookie cookie = new Cookie("Idam.Session", "value");
        doReturn(new Cookie[]{cookie}).when(request).getCookies();
        assertTrue(filter.hasSessionCookie(request));
    }

}