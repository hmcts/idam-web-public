let Helper = codecept_helper;
const TestData = require('../config/test_data');
const testConfig = require('../config/test_data.js');
const fetch = require('node-fetch');
const uuid = require('uuid');

class RefDataHelper extends Helper {

    refDataEnabled() {
        return TestData.REF_DATA_URL;
    }

    getServiceAuthToken() {
        let payload = {
            microservice: 'rd_professional_api'
        };
        return fetch(`${TestData.RPE_AUTH_URL}/testing-support/lease`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json'},
        }).then(response => {
            if (response.status !== 200) {
                console.log(`Error getting service token for rd_professional_api, response: ${response.status}`);
            }
            return response.text();
        }).catch(err => {
            console.log(err);
        });
    }

    getTestOrganisation(testCompanyNumber) {
        let superuserPayload = {
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'freg-test-user-idamorgsuper' + testCompanyNumber + '@prdfunctestuser.com'
        };
        let org = {
          name: 'idamtest_' + testCompanyNumber,
          sraId: 'idamtest_' + testCompanyNumber,
          sraRegulated: 'false',
          companyNumber: testCompanyNumber,
          companyUrl: 'http://idamtest' + testCompanyNumber +'.com',
          status: 'ACTIVE',
          superUser: superuserPayload,
          contactInformation: []
        };
        return org;
    }

    createOrganisation(payload, serviceToken, authToken) {
        return fetch(`${TestData.REF_DATA_URL}/refdata/internal/v1/organisations`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'ServiceAuthorization': 'Bearer ' + serviceToken,
                'Authorization': 'Bearer ' + authToken
            },
        }).then(response => {
            if (response.status !== 201) {
                console.log(`Error creating organisation, response: ${response.status}`);
            }
            return response.json();
        }).catch(err => {
            console.log(err);
        });
    }

    updateOrganisation(organisationId, payload, serviceToken, authToken) {
        return fetch(`${TestData.REF_DATA_URL}/refdata/internal/v1/organisations/${organisationId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'ServiceAuthorization': 'Bearer ' + serviceToken,
                'Authorization': 'Bearer ' + authToken
            },
        }).then(response => {
            if (response.status !== 200) {
                console.log(`Error updating organisation ${organisationId}, response: ${response.status}`);
            }
            return response;
        }).catch(err => {
            console.log(err);
        });
    }

    updateOrganisationMFA(organisationId, mfaType, serviceToken, authToken) {
        let payload = {
            mfa: mfaType
        };
        return fetch(`${TestData.REF_DATA_URL}/refdata/internal/v1/organisations/${organisationId}/mfa`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'ServiceAuthorization': 'Bearer ' + serviceToken,
                'Authorization': 'Bearer ' + authToken
            },
        }).then(response => {
            if (response.status !== 200) {
                console.log(`Error updating organisation mfa ${organisationId}, response: ${response.status}`);
            }
            return response;
        }).catch(err => {
            console.log(err);
        });
    }

    addUserToOrganisation(organisationId, userEmail, role, serviceToken, authToken) {
        let payload = {
              firstName: 'firstname',
              lastName: 'lastname',
              email: userEmail,
              roles: [
                role
              ],
              resendInvite: false
        };
        return fetch(`${TestData.REF_DATA_URL}/refdata/internal/v1/organisations/${organisationId}/users/`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'ServiceAuthorization': 'Bearer ' + serviceToken,
                'Authorization': 'Bearer ' + authToken
            },
        }).then(response => {
            if (response.status !== 201) {
                console.log(`Error adding user ${userEmail} to organisation ${organisationId}, response: ${response.status}`);
            }
            return response.json();
        }).catch(err => {
            console.log(err);
        });
    }

    deleteOrganisation(organisationId, serviceToken, authToken) {
        return fetch(`${TestData.REF_DATA_URL}/refdata/internal/v1/organisations/${organisationId}`, {
            method: 'DELETE',
            headers: {
                'ServiceAuthorization': 'Bearer ' + serviceToken,
                'Authorization': 'Bearer ' + authToken
            }
        }).then(response => {
            if (response.status !== 204) {
                console.log(`Error deleting organisation ${organisationId}, response: ${response.status}`);
            }
            return response;
        }).catch(err => {
            console.log(err);
        });
    }

}

module.exports = RefDataHelper;