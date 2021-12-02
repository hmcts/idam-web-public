package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@ConditionalOnMissingBean(AppConfigurationSSO.class)
public class AppConfiguration extends WebSecurityConfigurerAdapter {

    @Value("${features.dynatrace.monitor.endpoint}")
    private String dynatraceMonitorEndpoint;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
                .ignoringAntMatchers("/o/**")
                .ignoringAntMatchers(dynatraceMonitorEndpoint)
            .csrfTokenRepository(new CookieCsrfTokenRepository()).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
                .antMatchers("/o/**").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/assets/**").permitAll()
                .antMatchers("/users/register").permitAll()
                .antMatchers("/users/activate").permitAll()
                .anyRequest().permitAll();
        // @formatter:on
    }

}
