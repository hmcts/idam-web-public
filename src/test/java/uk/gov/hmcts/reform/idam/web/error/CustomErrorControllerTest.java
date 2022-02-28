package uk.gov.hmcts.reform.idam.web.error;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(CustomErrorController.class)
@TestPropertySource(properties = "testing=true")
public class CustomErrorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    HttpServletRequest request;

    @Test
    public void errorPage_shouldUsuallyReturnSuccessfully() throws Exception {
        mockMvc.perform(get("/error"))
            .andExpect(status().is2xxSuccessful());
    }

}