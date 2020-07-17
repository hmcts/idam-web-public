package uk.gov.hmcts.reform.idam.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import static org.springframework.http.ResponseEntity.ok;

@Slf4j
@Controller
public class SSOController {

    public SSOController() {

    }

    @GetMapping("/sso/handle")
    public ResponseEntity<Void> expiredTokenView() {
        System.out.println("SOMETHING HAPPENED");
        return ok().build();
    }
}
