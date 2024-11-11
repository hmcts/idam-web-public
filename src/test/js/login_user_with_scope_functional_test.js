const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('Service can request a scope on user authentication');

const customScope = 'manage-roles';
const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();
const citizenRole = 'citizen';
const pinUserRolePrefix = 'letter-';
let citizenUserDynamicRole;
let pinUserDynamicRole;
let accessToken;

const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&scope=${customScope}`;

BeforeSuite(async ({ I }) => {
    const testingToken = await I.getToken();
    citizenUserDynamicRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix), '', [], testingToken);
    pinUserDynamicRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix), '', [], testingToken);

    let serviceRoleNames = [citizenUserDynamicRole.name, pinUserDynamicRole.name];
    let serviceRoleIds = [citizenUserDynamicRole.id, pinUserDynamicRole.id];
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,[],testingToken, ["openid", "profile", "roles", "manage-roles"],[])

    I.wait(0.5);

    accessToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
});

Scenario('@functional @loginuserwithscope As a service, I can request a custom scope on user login', async ({ I }) => {

    let citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, citizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Citizen', []);

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', userPassword);

    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    await I.grantRoleToUser(citizenUserDynamicRole.name, accessToken);

    let userInfo = await I.getUserInfo(accessToken);
    expect(userInfo.roles).to.deep.equal([citizenUserDynamicRole.name]);

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @loginuserwithscope As a service, I can request a custom scope on PIN user login', async ({ I }) => {

    const randomText = randomData.getRandomString();
    citizenFirstName = citizenLastName = randomText;

    let pinUser = await I.getPinUser(citizenFirstName, citizenLastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;
    let code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let respondentEmail = 'respondent.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, respondentEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Respondent', []);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&scope=${customScope}&jwt=${accessToken}`)
    I.waitForText('Sign in or create an account');
    I.fillField('#username', respondentEmail);
    I.fillField('#password', userPassword);

    I.interceptRequestsAfterSignin();
    I.clickWithWait('.form input[type=submit]');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    await I.grantRoleToUser(pinUserDynamicRole.name, accessToken);

    let userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.roles).to.deep.equalInAnyOrder([pinUserRole, citizenRole, pinUserDynamicRole.name]);
    I.resetRequestInterception();
    I.cleanupLetterHolderRoles(accessToken,userInfo.roles)
}).retry(TestData.SCENARIO_RETRY_LIMIT);