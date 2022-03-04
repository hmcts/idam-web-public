package uk.gov.hmcts.reform.idam.web.error;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.SocketTimeoutException;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(CustomErrorController.class)
@TestPropertySource(properties = "testing=true")
public class CustomErrorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CustomErrorController controller;

    @Test
    public void errorPage_shouldUsuallyReturnSuccessfully() throws Exception {
        mockMvc.perform(get("/error"))
            .andExpect(status().is2xxSuccessful());
    }

    @Test
    public void errorPage_shouldUsuallyReturn2xxOnIOException() throws Exception {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);
        given(mockRequest.getAttribute(RequestDispatcher.ERROR_STATUS_CODE))
            .willReturn("500");
        given(mockRequest.getAttribute(RequestDispatcher.ERROR_EXCEPTION))
            .willReturn(new SocketTimeoutException("A Connection Timed Out"));
        controller.error(mockRequest, mockResponse);
        verify(mockResponse).setStatus(200);
    }

}