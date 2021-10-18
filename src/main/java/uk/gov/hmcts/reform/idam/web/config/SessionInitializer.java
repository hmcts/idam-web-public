package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;

public class SessionInitializer extends AbstractHttpSessionApplicationInitializer {

    public SessionInitializer() {
        super(SessionConfiguration.class);
        System.out.println("SessionInitializer");
    }
}
