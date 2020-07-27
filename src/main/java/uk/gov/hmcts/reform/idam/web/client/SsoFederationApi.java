package uk.gov.hmcts.reform.idam.web.client;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import feign.Response;
import uk.gov.hmcts.reform.idam.api.shared.model.User;

public interface SsoFederationApi {

    @RequestLine("POST /api/v1/federatedusers")
    @Headers({
        "Accept: application/json",
        "Authorization: {authorization}"
    })
    User createFederatedUser(@Param("authorization") String authorization);

    @RequestLine("POST /api/v1/federatedusers/authenticate")
    @Headers({
        "Accept: application/json",
        "Authorization: {authorization}"
    })
    Response federationAuthenticate(@Param("authorization") String authorization);

    @RequestLine("GET /api/v1/federatedusers/me")
    @Headers({
        "Accept: application/json",
        "Authorization: {authorization}"
    })
    User getFederatedUser(@Param("authorization") String authorization);

    @RequestLine("PUT /api/v1/federatedusers/me")
    @Headers({
        "Accept: application/json",
        "Authorization: {authorization}"
    })
    User updateFederatedUser(@Param("authorization") String authorization);
}
