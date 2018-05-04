package uk.gov.hmcts.reform.idam.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

@SpringBootApplication
@ComponentScan("uk.gov.hmcts.reform.idam")
@EnableConfigurationProperties(ConfigurationProperties.class)
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(final String args[]) {
        SpringApplication.run(Application.class, args);
    }

}
