package uk.gov.hmcts.reform.idam.web.config;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.net.URI;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@TestPropertySource(properties = {"testing=true", "features.federated-s-s-o=false"})
public class AppConfigurationTest {
    @Autowired
    private MockMvc mvc;

    @Test
    @WithMockUser(value = "spring")
    public void assets_shouldNotThrow401() throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get("/assets/test")
            .contentType(MediaType.APPLICATION_JSON);
        mvc.perform(req)
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(value = "spring")
    public void register_shouldRequireCsrf() throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get("/users/register")
            .contentType(MediaType.APPLICATION_JSON);
        mvc.perform(req)
            .andExpect(status().isBadRequest());
    }

    @Test
    public void suspicious_Requests_should_return_http_400() throws Exception {
        MockHttpServletRequestBuilder requestWithPotentiallyMaliciousString = MockMvcRequestBuilders.
            get(URI.create("/t_uri=https://www.moneyclaims.service.gov.uk/receiver"));
        mvc.perform(requestWithPotentiallyMaliciousString)
            .andExpect(status().isBadRequest());
    }

    @Test
    public void disallowed_http_methods_should_return_http_400() throws Exception {
        MockHttpServletRequestBuilder requestWithNotAllowedHttpMethod = MockMvcRequestBuilders.
            request("DEBUG", URI.create("/"));
        mvc.perform(requestWithNotAllowedHttpMethod)
            .andExpect(status().isBadRequest());
    }

    @Test
    public void security_headers_should_be_present() throws Exception {
        MockHttpServletRequestBuilder getBaseUrl = MockMvcRequestBuilders.
            request("GET", URI.create("/"));
        mvc.perform(getBaseUrl)
            .andExpect(header().string("Content-Security-Policy",
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self'; " +
                "img-src 'self' data:; " +
                "font-src 'self' data:; " +
                "frame-ancestors 'none';"))
            .andExpect(header().string("Permissions-Policy",
                "camera=(), geolocation=(), microphone=()"))
            .andExpect(header().string("Referrer-Policy", "strict-origin-when-cross-origin"))
            .andExpect(header().string("X-Content-Type-Options", "nosniff"))
            .andExpect(header().string("X-Frame-Options", "DENY"))
            .andExpect(header().string("X-XSS-Protection", "1; mode=block"));
    }
}