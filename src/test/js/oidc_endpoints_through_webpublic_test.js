Feature('Expose OpenId connect endpoints through web public');
const chai = require('chai');
const { expect } = chai;
const TestData = require('./config/test_data');

Scenario('@smoke Verify OpenId connect endpoints config through web public', async (I) => {
    let isHttp = TestData.IDAM_API.startsWith("http://");
    let expectedBaseUrl = isHttp ? TestData.WEB_PUBLIC_URL.replace("https://", "http://") : TestData.WEB_PUBLIC_URL;
    let response = await I.getOidcEndPointsConfig(TestData.WEB_PUBLIC_URL);
    expect(response.authorization_endpoint, 'authorization endpoint').to.equal(expectedBaseUrl+'/o/authorize');
    expect(response.token_endpoint, 'token endpoint').to.equal(expectedBaseUrl+'/o/token');
    expect(response.userinfo_endpoint, 'user info endpoint').to.equal(expectedBaseUrl+'/o/userinfo');
    expect(response.end_session_endpoint, 'end session endpoint').to.equal(expectedBaseUrl+'/o/endSession');
    expect(response.jwks_uri, 'jwks uri').to.equal(expectedBaseUrl+'/o/jwks');
});