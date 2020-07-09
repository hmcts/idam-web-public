package uk.gov.hmcts.reform.idam.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@RestController
public class HelloController {

    @Autowired
    private StringRedisTemplate template;

    @RequestMapping("/")
    // Define the Hello World controller.
    public String hello() {

        ValueOperations<String, String> ops = this.template.opsForValue();

        // Add a Hello World string to your cache.
        String key = "greeting";
        if (!this.template.hasKey(key)) {
            ops.set(key, "Hello World!");
        }

        // Return the string from your cache.
        return ops.get(key);
    }
}
