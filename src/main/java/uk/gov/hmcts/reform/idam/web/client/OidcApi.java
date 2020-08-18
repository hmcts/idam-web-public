package uk.gov.hmcts.reform.idam.web.client;

import feign.Headers;
import feign.Param;
import feign.QueryMap;
import feign.RequestLine;
import feign.Response;

import java.util.Map;

public interface OidcApi {

    @RequestLine("POST /o/authorize")
    @Headers({
        "Content-Type: application/x-www-form-urlencoded",
        "Accept: application/json",
        "Cookie: {cookie}"
    })
    Response oauth2AuthorizePost(@Param("cookie") String cookie, @QueryMap(encoded=true) Map<String, Object> queryParams);
}
