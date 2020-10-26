package uk.gov.hmcts.reform.idam.web.strategic;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.config.properties.StrategicConfigurationProperties;
import uk.gov.hmcts.reform.idam.web.sso.SSOZuulFilter;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;

class StepUpAuthenticationZuulFilterTest {

    private ConfigurationProperties config;
    private StepUpAuthenticationZuulFilter filter;

    @BeforeEach
    public void setUp() {
        this.config = new ConfigurationProperties();
        StrategicConfigurationProperties strategicProperties = new StrategicConfigurationProperties();
        StrategicConfigurationProperties.Session session = new StrategicConfigurationProperties.Session();
        session.setIdamSessionCookie("Idam.Session");
        strategicProperties.setSession(session);
        this.config.setStrategic(strategicProperties);
        this.filter = new StepUpAuthenticationZuulFilter(config, null);
    }

    @Test
    void filterType() {
        assertEquals(PRE_TYPE, filter.filterType());
    }

    @Test
    void filterOrder() {
        assertTrue(filter.filterOrder() > SSOZuulFilter.FILTER_ORDER);
    }

    @Test
    void shouldFilter() {
    }

    @Test
    void run() {
    }

    @Test
    void getSessionToken() {
    }

    @Test
    void isAuthorizeRequest() {
    }

    @Test
    void hasSessionCookie() {
    }

    @Test
    void copyRequestParameters() {
    }

    @Test
    void zuulError() {
    }

    @Test
    void getCookiesFromRequest() {
    }
}