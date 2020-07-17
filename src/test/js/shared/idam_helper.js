let Helper = codecept_helper;
const TestData = require('../config/test_data');
const fetch = require('node-fetch');

let agentToUse;
if (process.env.PROXY_SERVER) {
    console.log('using proxy agent: ' + process.env.PROXY_SERVER);
    const HttpsProxyAgent = require('https-proxy-agent');
    agentToUse = new HttpsProxyAgent(process.env.PROXY_SERVER);
} else if (process.env.LOCAL_TEST_SERVER) {
    // default agent
} else {
    console.log('using real agent');
    const Https = require('https');
    agentToUse = new Https.Agent({
        rejectUnauthorized: false
    });
}
const agent = agentToUse;

let notifyClient;
const NotifyClient = require('notifications-node-client').NotifyClient;
if (TestData.NOTIFY_API_KEY) {
    notifyClient = new NotifyClient(TestData.NOTIFY_API_KEY);
} else {
    console.log("Notify client API key is not defined");
}

const URLSearchParams = require('url').URLSearchParams;

class IdamHelper extends Helper {

    async createServiceData(serviceName) {
        const token = await this.getAuthToken();
        this.createService(serviceName, '', token);
    }

    deleteService(service) {
        return fetch(`${TestData.IDAM_API}/testing-support/services/${service}`, {
            agent: agent,
            method: 'DELETE'
        });
    }

    deleteRole(role) {
        return fetch(`${TestData.IDAM_API}/testing-support/roles/${role}`, {
            agent: agent,
            method: 'DELETE'
        });
    }

    getBase64(email_address, password) {
        console.log("BASE64-ENCODED " + Buffer.from(email_address + ":" + password).toString('base64'))
        return Buffer.from(email_address + ":" + password).toString('base64')
    }

    getBase64FromJsonObject(jsonObject) {
        console.log("BASE64-ENCODED " + Buffer.from(jsonObject).toString('base64'))
        return Buffer.from(jsonObject).toString('base64')
    }

    getAuthorizeCode(serviceName, serviceRedirect, oauth2Scope, base64) {
        let searchParams = new URLSearchParams();
        searchParams.set('response_type', 'code');
        searchParams.set('client_id', serviceName);
        searchParams.set('redirect_uri', serviceRedirect);
        searchParams.set('scope', oauth2Scope);

        console.log("body: " + searchParams);
        console.log(base64)

        return fetch(`${TestData.IDAM_API}/oauth2/authorize`, {
            agent: agent,
            method: 'POST',
            body: searchParams,
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + base64}
        }).then(response => {
            return response.json();
        }).then((json) => {
            console.log("Code: " + json.code);
            return json.code;
        })
    }


    createService(serviceName, roleId, token, scope = '') {
        let data;

        if (roleId === '') {
            data = {
                label: serviceName,
                description: serviceName,
                oauth2ClientId: serviceName,
                oauth2ClientSecret: TestData.SERVICE_CLIENT_SECRET,
                oauth2RedirectUris: [TestData.SERVICE_REDIRECT_URI],
                oauth2Scope: scope,
                onboardingEndpoint: '/autotest',
                onboardingRoles: ['auto-private-beta_role'],
                activationRedirectUrl: TestData.SERVICE_REDIRECT_URI,
                selfRegistrationAllowed: true
            };
        } else {
            data = {
                label: serviceName,
                description: serviceName,
                oauth2ClientId: serviceName,
                oauth2ClientSecret: TestData.SERVICE_CLIENT_SECRET,
                oauth2RedirectUris: [TestData.SERVICE_REDIRECT_URI],
                oauth2Scope: scope,
                onboardingEndpoint: '/autotest',
                onboardingRoles: ['auto-private-beta_role'],
                allowedRoles: [roleId, 'auto-admin_role'],
                activationRedirectUrl: TestData.SERVICE_REDIRECT_URI,
                selfRegistrationAllowed: true
            };
        }
        return fetch(`${TestData.IDAM_API}/services`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + token},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => err);
    }

    createServiceWithRoles(serviceName, serviceRoles, betaRole, token, scope) {
        if (scope == null) {
            scope = ''
        }
        const data = {
            label: serviceName,
            description: serviceName,
            oauth2ClientId: serviceName,
            oauth2ClientSecret: TestData.SERVICE_CLIENT_SECRET,
            oauth2RedirectUris: [TestData.SERVICE_REDIRECT_URI],
            oauth2Scope: scope,
            onboardingEndpoint: '/autotest',
            onboardingRoles: [betaRole],
            allowedRoles: serviceRoles,
            activationRedirectUrl: TestData.SERVICE_REDIRECT_URI,
            selfRegistrationAllowed: true
        };
        return fetch(`${TestData.IDAM_API}/services`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + token},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => err);
    }

    getAuthToken() {
        return fetch(`${TestData.IDAM_API}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
            agent: agent,
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(
            function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log('Admin auth token failed first attempt with response ' + response.status + ' from ' + TestData.IDAM_API + ' user: ' + TestData.SMOKE_TEST_USER_USERNAME + ' password ' + TestData.SMOKE_TEST_USER_PASSWORD);

                    // retry!
                    return fetch(`${TestData.IDAM_API}/loginUser?username=${TestData.SMOKE_TEST_USER_USERNAME}&password=${TestData.SMOKE_TEST_USER_PASSWORD}`, {
                        agent: agent,
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).then(
                        function (response) {
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                console.log('Admin auth token failed second attempt with response ' + response.status + ' from ' + TestData.IDAM_API + ' user: ' + TestData.SMOKE_TEST_USER_USERNAME + ' password ' + TestData.SMOKE_TEST_USER_PASSWORD);
                            }
                        }
                    );
                }
            }
        ).then(
            function (json) {
                console.log('Admin auth token received');
                return json.api_auth_token;
            });
    }

    deleteUser(email) {
        return fetch(`${TestData.IDAM_API}/testing-support/accounts/${email}`, {
            agent: agent,
            method: 'DELETE'
        })
            .catch(err => err);
    }

    createRole(roleName, roleDescription, assignableRoles, api_auth_token) {

        const data = {
            assignableRoles: [assignableRoles],
            conflictingRoles: [],
            description: roleDescription,
            name: roleName,
            id: roleName,
        };

        return fetch(`${TestData.IDAM_API}/roles`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token},
        })
            .then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => err);
    }

    createUser(email, forename, role, serviceRole) {
        console.log('Creating user with email: ', email);
        const data = {
            email: email,
            forename: forename,
            password: TestData.PASSWORD,
            roles: [{code: role}, {code: serviceRole}],
            surname: 'User',
            userGroup: {code: 'xxx_private_beta'},
        };
        return fetch(`${TestData.IDAM_API}/testing-support/accounts`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => err);
    }

    createUserWithRoles(email, forename, userRoles) {
        const codeUserRoles = userRoles.map(role => ({'code': role}));
        const data = {
            email: email,
            forename: forename,
            password: TestData.PASSWORD,
            roles: codeUserRoles,
            surname: 'User',
            userGroup: {code: 'xxx_private_beta'}
        };
        return fetch(`${TestData.IDAM_API}/testing-support/accounts`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => err);
    }

    createPolicyToBlockUser(name, userEmail, api_auth_token) {
        const data = {
            "name": name,
            "applicationName": "HmctsPolicySet",
            "description": "Blocks specific user",
            "active": true,
            "actionValues": {
                "GET": false,
                "POST": false,
                "DELETE": false,
                "PATCH": false,
                "PUT": false,
                "OPTIONS": false,
                "HEAD": false
            },
            "resourceTypeUuid": "HmctsUrlResourceType",
            "resources": [
                "*://*",
                "*://*:*/*",
                "*://*:*/*?*",
                "*://*?*"
            ],
            "subject": {
                "type": "AND",
                "subjects": [
                    {
                        "type": "Identity",
                        "subjectValues": [
                            `id=${userEmail},ou=user,o=hmcts,ou=services,dc=reform,dc=hmcts,dc=net`
                        ]
                    }
                ]
            }
        };
        return fetch(`${TestData.IDAM_API}/api/v1/policies`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token},
        })
            .then(res => res.json())
            .catch(err => err);
    }

    createPolicyForMfaTest(name, roleName, api_auth_token) {
        const data = {
            "name": name,
            "applicationName": "HmctsPolicySet",
            "description": "Require MFA for test user",
            "active": true,
            "actionValues": {
                "GET": false,
                "POST": false,
                "DELETE": false,
                "PATCH": false,
                "PUT": false,
                "OPTIONS": false,
                "HEAD": false
            },
            "resourceTypeUuid": "HmctsUrlResourceType",
            "resources": [
                "*://*",
                "*://*:*/*",
                "*://*:*/*?*",
                "*://*?*"
            ],
            "resourceAttributes": [{
                "type": "Static",
                "propertyName": "mfaRequired",
                "propertyValues": ["true"]
            }],
            "subject": {
                "type": "Identity",
                "subjectValues": [
                    `id=${roleName},ou=group,o=hmcts,ou=services,dc=reform,dc=hmcts,dc=net`
                ]
            },
            "condition": {
                "type": "NOT",
                "condition": {
                    "type": "AuthLevel",
                    "authLevel": 1
                }
            }
        };
        return fetch(`${TestData.IDAM_API}/api/v1/policies`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token},
        })
            .then(res => res.json())
            .catch(err => err);
    }

    createPolicyForMfaBlockTest(name, roleName, api_auth_token) {
        const data = {
            "name": name,
            "applicationName": "HmctsPolicySet",
            "description": "Require MFA for test user",
            "active": true,
            "actionValues": {
                "GET": false,
                "POST": false,
                "DELETE": false,
                "PATCH": false,
                "PUT": false,
                "OPTIONS": false,
                "HEAD": false
            },
            "resourceTypeUuid": "HmctsUrlResourceType",
            "resources": [
                "*://*",
                "*://*:*/*",
                "*://*:*/*?*",
                "*://*?*"
            ],
            "resourceAttributes": [{
                "type": "Static",
                "propertyName": "blocked",
                "propertyValues": ["true"]
            }],
            "subject": {
                "type": "Identity",
                "subjectValues": [
                    `id=${roleName},ou=group,o=hmcts,ou=services,dc=reform,dc=hmcts,dc=net`
                ]
            },
            "condition": {
                "type": "NOT",
                "condition": {
                    "type": "IPv4",
                    "startIp": "0.0.0.1",
                    "endIp": "0.0.0.10",
                    "ipRange": [],
                    "dnsName": []
                }
            }
        };
        return fetch(`${TestData.IDAM_API}/api/v1/policies`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token},
        })
            .then(res => res.json())
            .catch(err => err);
    }

    deletePolicy(name, api_auth_token) {
        return fetch(`${TestData.IDAM_API}/api/v1/policies/${name}`, {
            agent: agent,
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': 'AdminApiAuthToken ' + api_auth_token},
        })
            .then(res => res.json())
            .catch(err => err);
    }

    getEmail(searchEmail) {
        return (
            notifyClient
                .getNotifications("email", null)
                .then(response => {
                    console.log("Searching " + response.body.notifications.length + " emails(s) from sending queue");
                    return this.searchForEmailInResults(response.body.notifications, searchEmail);
                })
                .then(emailResponse => {
                    if (emailResponse) {
                        return emailResponse;
                    } else {
                        return (
                            notifyClient.getNotifications("email", "failed")
                                .then(failedResponse => {
                                    console.log("Searching " + failedResponse.body.notifications.length + " emails(s) from failure queues");
                                    return this.searchForEmailInResults(failedResponse.body.notifications, searchEmail);
                                })
                                .then(failedEmailResponse => {
                                    if (failedEmailResponse) {
                                        return failedEmailResponse;
                                    } else {
                                        throw new Error('No emails found for ' + searchEmail);
                                    }
                                })
                        );
                    }
                })
        );
    }

    async extractUrl(searchEmail) {
        const emailResponse = await this.getEmail(searchEmail);
        return this.extractUrlFromBody(emailResponse);
    }

    searchForEmailInResults(notifications, searchEmail) {
        const result = notifications.find(currentItem => {
            // NOTE: NEVER LOG EMAIL ADDRESS FROM THE PRODUCTION QUEUE
            if (currentItem.email_address === searchEmail) {
                return true;
            }
            return false;
        });
        return result;
    }

    extractUrlFromBody(emailResponse) {
        if (emailResponse) {
            const regex = "(https.+)"
            const url = emailResponse.body.match(regex);
            if (url[0]) {
                return url[0].replace(/https:\/\/idam-web-public[^\/]+/i, TestData.WEB_PUBLIC_URL).replace(")", "");
            }
        }
    }

    async extractOtpFromEmail(searchEmail) {
        return this.extractOtpFromEmailBody(await this.getEmail(searchEmail))
    }

    async extractOtpFromEmailBody(emailResponse) {
        if(emailResponse) {
            const regex = "[0-9]{8}";
            const url = emailResponse.body.match(regex);
            if (url[0]) {
                return url[0];
            }
        }
    }

    async getCurrentUrl() {
        const helper = this.helpers['Puppeteer'];
        console.log("Page is " + helper.page.url());
        return helper.page.url();
    }

    interceptRequestsAfterSignin() {
        const helper = this.helpers['Puppeteer'];
        helper.page.setRequestInterception(true);
        const pages = ["/login", "/register", "/activate", "/verification", "/useractivated"];

        helper.page.on('request', request => {
            if (pages.some(v => request.url().includes(v))) {
                request.continue();
            } else {
                request.respond({
                    status: 200,
                    contentType: 'application/javascript; charset=utf-8',
                    body: request.url()
                });
            }
        });
    }

    resetRequestInterception() {
        const helper = this.helpers['Puppeteer'];
        helper.page.setRequestInterception(false);
    }

    getPinUser(firstname, lastname) {
        const data = {
            firstName: firstname,
            lastName: lastname,
        };
        return fetch(`${TestData.IDAM_API}/pin`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => {
                console.log(err)
                let browser = this.helpers['Puppeteer'].browser;
                browser.close();
            });
    }

    loginAsPin(pin, clientId, serviceRedirect) {
        return fetch(`${TestData.IDAM_API}/pin?client_id=${clientId}&redirect_uri=${serviceRedirect}`, {
            agent: agent,
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'pin': pin},
            redirect: 'manual',
        }).then(response => {
            const location = response.headers.get('location');
            const code = location.match('(?<=code=)(.*)(?=&scope)');
            return code[0];
        })
            .catch(err => {
                console.log(err)
                let browser = this.helpers['Puppeteer'].browser;
                browser.close();
            });
    }

    getAccessToken(code, serviceName, serviceRedirect, clientSecret) {
        let searchParams = new URLSearchParams();
        searchParams.set('code', code);
        searchParams.set('redirect_uri', serviceRedirect);
        searchParams.set('grant_type', 'authorization_code')

        return fetch(`${TestData.IDAM_API}/oauth2/token`, {
            agent: agent,
            method: 'POST',
            body: searchParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + this.getBase64(serviceName, clientSecret)
            }
        }).then(response => {
            console.log(response)
            return response.json();
        }).then((json) => {
            console.log("Token: " + json.access_token);
            return json.access_token;
        }).catch(err => {
            console.log(err)
            let browser = this.helpers['Puppeteer'].browser;
            browser.close();
        });
    }

    getUserInfo(accessToken) {
        return fetch(`${TestData.IDAM_API}/details`, {
            agent: agent,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            if (response.status != 200) {
                console.log('Error getting user details', response.status);
                throw new Error()
            }
            return response.json();
        })
    }

    getOidcUserInfo(accessToken) {
        return fetch(`${TestData.IDAM_API}/o/userinfo`, {
            agent: agent,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            if (response.status != 200) {
                console.log('Error getting user details', response.status);
                throw new Error()
            }
            return response.json();
        })
    }

    grantRoleToUser(roleName, accessToken) {
        return fetch(`${TestData.IDAM_API}/account/role`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify({
                "name": roleName
            }),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }).then((response) => {
            if (response.status != 201) {
                console.log('Error granting role', response.status);
                throw new Error()
            }
        });
    }

    registerUserWithRoles(bearerToken, userEmail, userFirstName, userLastName, userRoles) {
        const data = {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            roles: [userRoles]
        };

        return fetch(`${TestData.IDAM_API}/user/registration`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + bearerToken},
        }).then((response) => {
            if (response.status != 200) {
                console.log('Error registering user', response.status);
                console.log(JSON.stringify(data));
                throw new Error()
            }
        });
    }

    registerUserWithId(bearerToken, userEmail, userFirstName, userLastName, userId, userRoles) {
        const data = {
            id: userId,
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            roles: [userRoles]
        };

        return fetch(`${TestData.IDAM_API}/api/v1/users/registration`, {
            agent: agent,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + bearerToken},
        }).then((response) => {
            if (response.status != 200) {
                console.log('Error creating user', response.status);
                console.log(JSON.stringify(data))
                throw new Error()
            }
        });
    }

    getOidcEndPointsConfig(url) {
        return fetch(`${url}/o/.well-known/openid-configuration`, {
            agent: agent,
            method: 'GET',
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => {
                console.log(err);
            });
    }

    getUserById(userId, bearerToken) {
        return fetch(`${TestData.IDAM_API}/api/v1/users/${userId}`, {
            agent: agent,
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + bearerToken},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => {
                console.log(err);
            });
    }

    async getUserByEmail(userEmail) {
        const authToken = await this.getAuthToken();
        return fetch(`${TestData.IDAM_API}/users?email=${userEmail}`, {
            agent: agent,
            method: 'GET',
            headers: {'Authorization': 'AdminApiAuthToken ' + authToken},
        }).then(res => res.json())
            .then((json) => {
                return json;
            })
            .catch(err => {
                console.log(err);
            });
    }

    async retireStaleUser(userEmail) {
        const userDetails = await this.getUserByEmail(userEmail);
        const userId = userDetails.id;
        const authToken = await this.getAuthToken();
        return fetch(`${TestData.IDAM_API}/api/v1/staleUsers/${userId}/retire`, {
            agent: agent,
            method: 'POST',
            headers: {'Authorization': 'AdminApiAuthToken ' + authToken},
        }).then((response) => {
            if (response.status !== 200) {
                console.log('Error retiring stale user', response.status);
                throw new Error();
            }
        });
    }

    deleteAllTestData(testDataPrefix = '', userNames = [], roleNames = [], serviceNames = [], async = false) {
        return fetch(`${TestData.IDAM_API}/testing-support/test-data?async=${async}&userNames=${userNames.join(',')}&roleNames=${roleNames.join(',')}&testDataPrefix=${testDataPrefix}&serviceNames=${serviceNames.join(',')}`, {
            agent: agent,
            method: 'DELETE'
        }).then(response => {
            return response.json();
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = IdamHelper;
