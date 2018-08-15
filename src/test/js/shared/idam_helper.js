let Helper = codecept_helper;
var TestData = require('../config/test_data');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const Https = require('https');
const agent = new Https.Agent({
    rejectUnauthorized: false
})
// Proxy agent settings if needed in future.
/*
const agent = new HttpsProxyAgent({
    proxyHost: 'proxyout.reform.hmcts.net',
    proxyPort: 8080
})
*/

class IdamHelper extends Helper {

    async createServiceData(serviceName){
        let token = await this.getAuthToken();
        this.createService(serviceName, token);

    }

    deleteService(service) {

        // for localhost
        //return fetch(`${TestData.IDAM_API}/testing-support/services/${service}`, { method: 'DELETE' });

        return fetch(`${TestData.IDAM_API}/testing-support/services/${service}`, { agent: agent, method: 'DELETE' });
    }

    deleteRole(role) {

        // for localhost
        //return fetch(`${TestData.IDAM_API}/testing-support/roles/${role}`, { method: 'DELETE' });

        return fetch(`${TestData.IDAM_API}/testing-support/roles/${role}`, { agent: agent, method: 'DELETE' });
    }

    createService(serviceName, token) {

        const data = {
            label: serviceName,
            description: serviceName,
            oauth2ClientId: serviceName,
            oauth2ClientSecret: 'autotestingservice',
            oauth2RedirectUris: ['https://www.autotest.com'],
            onboardingEndpoint: '/autotest',
            activationRedirectUrl: "https://www.autotest.com",
            selfRegistrationAllowed: true
        };

        return fetch(`${TestData.IDAM_API}/services`, {
            //Comment in localhost
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + token },
        }).then(res => res.json())
    .then((json) => {
            return json;
    })
    .catch(err => err);
    }

    getAuthToken(){
        const api = TestData.IDAM_API;
        console.log("Api", api);

        return   fetch(`${api}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
            //Comment in localhost
            agent: agent,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(function(response) {
            return response.json();
        }).then(function(json) {
            return json.api_auth_token;
        });
    }

}

module.exports = IdamHelper;