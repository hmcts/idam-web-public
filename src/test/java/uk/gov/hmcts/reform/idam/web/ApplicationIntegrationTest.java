package uk.gov.hmcts.reform.idam.web;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(properties = {"ssl.verification.enabled=false",
    "spring.autoconfigure.exclude=com.microsoft.applicationinsights.boot.ApplicationInsightsTelemetryAutoConfiguration"})
public class ApplicationIntegrationTest {

    @Test
    public void applicationContext_shouldLoad() {
        Assert.assertTrue(true);
    }

}
