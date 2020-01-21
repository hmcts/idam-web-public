const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Policy check');

let token;
let citizenEmail;
let policyName;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

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
    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName + 'Admin');
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

Scenario('@functional @crossbroswer @policy As a citizen with policies blocking me from login I should see an error message', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail.toUpperCase());
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(10);
    I.waitForText('Policies check failed', 10, 'h2');

}).retry(TestData.SCENARIO_RETRY_LIMIT);