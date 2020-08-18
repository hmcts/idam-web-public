package uk.gov.hmcts.reform.idam.web.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;

@TestConfiguration
public class TestConfig {

    @MockBean
    OAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository;

    @MockBean
    ClientRegistrationRepository clientRegistrationRepository;
}
