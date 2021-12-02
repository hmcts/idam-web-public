package uk.gov.hmcts.reform.idam.web.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import javax.servlet.http.HttpServletRequest;

@Configuration
public class AppCSRFConfiguration {

    @Value("${features.dynatrace.monitor.endpoint}")
    private String dynatraceMonitorEndpoint;

    @Bean
    public RequestMatcher csrfRequestMatcher() {
        return new RequestMatcher() {

            final AntPathRequestMatcher oidcMatcher = new AntPathRequestMatcher("/o/**");
            final AntPathRequestMatcher dynatraceMatcher = StringUtils.isNotEmpty(dynatraceMonitorEndpoint) ?
                new AntPathRequestMatcher(dynatraceMonitorEndpoint) : null;

            @Override
            public boolean matches(HttpServletRequest request) {
                if (dynatraceMatcher != null && dynatraceMatcher.matches(request)) {
                    return false;
                }
                return !oidcMatcher.matches(request);
            }
        };
    }

}
