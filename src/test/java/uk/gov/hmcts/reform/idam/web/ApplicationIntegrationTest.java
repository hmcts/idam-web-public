package uk.gov.hmcts.reform.idam.web;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"ssl.verification.enabled=false"})
public class ApplicationIntegrationTest {

    @Test
    public void applicationContext_shouldLoad() {
        Assertions.assertTrue(true);
    }

}
