package uk.gov.hmcts.reform.idam.web.config;

import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@WebMvcTest
@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@TestPropertySource(properties = {"testing=true", "features.federated-s-s-o=true"})
public class AppConfigurationSSOTest extends AppConfigurationTest {

}