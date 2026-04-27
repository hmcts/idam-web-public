package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.header.HeaderWriterFilter;

@Configuration
public class SpringSecurityHeaderWriterConfiguration {

    @Bean
    public static BeanPostProcessor eagerHeaderWriterFilterBeanPostProcessor() {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
                if (bean instanceof HeaderWriterFilter headerWriterFilter) {
                    headerWriterFilter.setShouldWriteHeadersEagerly(true);
                }
                return bean;
            }
        };
    }
}
