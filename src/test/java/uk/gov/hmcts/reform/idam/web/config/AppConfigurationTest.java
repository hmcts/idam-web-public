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
}