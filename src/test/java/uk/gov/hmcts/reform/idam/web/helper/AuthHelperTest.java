package uk.gov.hmcts.reform.idam.web.helper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
public class AuthHelperTest {


    @Test
    public void makeCookiesSecure_shouldReturnASecureCookie() {
        AuthHelper authHelper = new AuthHelper(true);
        List<String> cookies = authHelper.makeCookiesSecure(Arrays.asList("cookie"));
        assertEquals("cookie; Path=/; Secure; HttpOnly", cookies.get(0));
    }


    @Test
    public void makeCookiesSecure_shouldReturnANonSecureCookie() {
        AuthHelper authHelper = new AuthHelper(false);
        List<String> cookies = authHelper.makeCookiesSecure(Arrays.asList("cookie"));
        assertEquals("cookie; Path=/; HttpOnly", cookies.get(0));
    }

    @Test
    public void makeCookiesSecure_shouldReturnANonSecureCookieAndAlreadyContainsHttpOnlyAndSecureFlag() {
        AuthHelper authHelper = new AuthHelper(false);
        List<String> cookies = authHelper.makeCookiesSecure(Arrays.asList("cookie; Secure; HttpOnly"));
        assertEquals("cookie; Secure; HttpOnly; Path=/", cookies.get(0));
    }

}