const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Policy check');

let token;
let citizenEmail;
let policyName;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const box = {
    left: 100,
    top: 200,
    right: 200,
    bottom: 600
};
const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    const randomUserFirstName = randomData.getRandomUserName();
    const adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    policyName = `SIDM_TEST_POLICY_${serviceName}`;

    token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_beta", 'beta description', '', token);
    const serviceBetaRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_admin", 'admin description', serviceBetaRole, token);
    const serviceAdminRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_super", 'super description', serviceAdminRole, token);
    const serviceSuperRole = response.name;
    const serviceRoles = [serviceBetaRole, serviceAdminRole, serviceSuperRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceBetaRole, token);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');

    await I.createPolicyToBlockUser(policyName, citizenEmail, token);
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX),
        I.deletePolicy(policyName, token),
    ]);
});

Scenario('@functional @policy @debug As a citizen with policies blocking me from login I should see an error message', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail.toUpperCase());
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.saveScreenshot( 'Polycheck-login.png')
    // I.seeVisualDiff('Polycheck-login.png', {tolerance: 6, prepareBaseImage: false, ignoredBox: box});
    I.waitForText('Policies check failed', 10, 'h2');

}).retry(TestData.SCENARIO_RETRY_LIMIT);