package uk.gov.hmcts.reform.idam.web;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import uk.gov.hmcts.reform.idam.web.config.properties.ConfigurationProperties;

@SpringBootApplication
@ComponentScan("uk.gov.hmcts.reform.idam")
@EnableZuulProxy
@EnableConfigurationProperties(ConfigurationProperties.class)
public class Application extends SpringBootServletInitializer {

    @Getter
    @Setter
    private static ApplicationContext context;

    @Override
    protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(final String args[]) {
        Application.context = SpringApplication.run(Application.class, args);
    }

}
