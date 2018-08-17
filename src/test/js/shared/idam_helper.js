let Helper = codecept_helper;
var TestData = require('../config/test_data');
const fetch = require('node-fetch');

class IdamHelper extends Helper {

    async createServiceData(serviceName){
        let token = await this.getAuthToken();
        this.createService(serviceName, token);

    }

    deleteService(service) {

        return fetch(`${TestData.IDAM_API}/testing-support/services/${service}`, { method: 'DELETE' });
    }

    deleteRole(role) {

        return fetch(`${TestData.IDAM_API}/testing-support/roles/${role}`, { method: 'DELETE' });
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

        return   fetch(`${TestData.IDAM_API}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
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