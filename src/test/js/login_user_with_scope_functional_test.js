const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const jwt_decode = require('jwt-decode');

const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('Service can request a scope on user authentication');

const customScope = 'custom-test-scope';
const testSuitePrefix = "luwstest" + randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();
const citizenRole = 'citizen';
const pinUserRolePrefix = 'letter-';
let citizenUserDynamicRole;
let pinUserDynamicRole;
let testingToken;

let rolesToCleanup = [];

const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&scope=${customScope}`;

BeforeSuite(async ({ I }) => {
    testingToken = await I.getToken();
    pinUserDynamicRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix), '', [], testingToken);

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,[],testingToken, ["openid", "profile", "roles", "custom-test-scope"],[])

    I.wait(0.5);
});

AfterSuite(async ({ I }) => {
    if (rolesToCleanup.length > 0) {
        await I.cleanupLetterHolderRoles(testingToken, rolesToCleanup);
    }
});

Scenario('@functional @loginuserwithscope As a service, I can request a custom scope on user login', async ({ I }) => {

    let citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(testingToken, citizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Citizen', []);

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', userPassword);

    I.startRedirectRequestTracking();
    I.clickWithWait('Sign in');
    let {code} = await I.waitForRedirectWithCodeTo(TestData.SERVICE_REDIRECT_URI);
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    const decodedAccessToken = jwt_decode(accessToken);
    expect(decodedAccessToken.scope).to.deep.equal([customScope]);

    I.stopRedirectRequestTracking();

}).retry(TestData.SCENARIO_RETRY_LIMIT);
