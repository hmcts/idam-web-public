const chai = require('chai');
const {expect} = chai;
var TestData = require('./config/test_data');

Feature('Policy check');

let token;

let adminEmail;
let randomUserLastName;
let citizenEmail;
let policyName;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const serviceRedirectUri = "https://idam.testservice.gov.uk";

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    citizenEmail = 'citizen.' + randomUserLastName + testMailSuffix;
    policyName = `SIDM_TEST_POLICY_${serviceName}`;

    token = await I.getAuthToken();
    await I.createRole(serviceName + "_beta", 'beta description', '', token);
    await I.createRole(serviceName + "_admin", 'admin description', serviceName + "_beta", token);
    await I.createRole(serviceName + "_super", 'super description', serviceName + "_admin", token);
    var serviceRoles = [serviceName + "_beta", serviceName + "_admin", serviceName + "_super"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_admin", "IDAM_ADMIN_USER"]);
    await I.createUserWithRoles(citizenEmail, 'Citizen', ["citizen"]);

    await I.createPolicyToBlockUser(policyName, citizenEmail, token);
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteUser(adminEmail),
        I.deleteUser(citizenEmail),
        I.deleteService(serviceName),
        I.deletePolicy(policyName, token),
    ]);
});

Scenario('@functional @policy As a citizen with policies blocking me from login I should see an error message', async (I) => {
    var loginUrl = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail.toUpperCase());
    I.fillField('#password', password);
    I.click('Sign in');
    I.wait(10);
    I.waitForText('Policies check failed', 10, 'h2');

}).retry(TestData.SCENARIO_RETRY_LIMIT);