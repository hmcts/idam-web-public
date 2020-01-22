const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('Service can request a scope on user authentication');

let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const customScope = 'manage-roles';
const serviceName = randomData.getRandomServiceName();
const citizenRole = 'citizen';
const pinUserRolePrefix = 'letter-';
const dynamicRoleNameForCitizenUser = randomData.getRandomRoleName();
const dynamicRoleNameForPinUser = randomData.getRandomRoleName();

const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&scope=${customScope}`;

let randomUserFirstName, citizenFirstName, citizenLastName, citizenEmail, respondentEmail;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    const randomText = randomData.getRandomString();
    citizenFirstName = citizenLastName = randomText;
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    respondentEmail = 'respondent.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    let response;
    response = await I.createRole(dynamicRoleNameForCitizenUser, '', '', token);
    roleNames.push(response.name);
    response = await I.createRole(dynamicRoleNameForPinUser, '', '', token);
    roleNames.push(response.name);
    await I.createServiceWithRoles(serviceName, [dynamicRoleNameForCitizenUser, dynamicRoleNameForPinUser], '', token, customScope);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', []);
    userFirstNames.push(randomUserFirstName + 'Citizen');
    await I.createUserWithRoles(respondentEmail, randomUserFirstName + 'Respondent', []);
    userFirstNames.push(randomUserFirstName + 'Respondent');
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional As a service, I can request a custom scope on user login', async (I) => {
    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', TestData.PASSWORD);

    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    await I.grantRoleToUser(dynamicRoleNameForCitizenUser, accessToken);

    let userInfo = await I.getUserInfo(accessToken);
    expect(userInfo.roles).to.deep.equal([dynamicRoleNameForCitizenUser]);

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional As a service, I can request a custom scope on PIN user login', async (I) => {
    let pinUser = await I.getPinUser(citizenFirstName, citizenLastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;
    let code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&scope=${customScope}&jwt=${accessToken}`)
    I.waitForText('Sign in or create an account', 30, 'h1');
    I.fillField('#username', respondentEmail);
    I.fillField('#password', TestData.PASSWORD);

    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    await I.grantRoleToUser(dynamicRoleNameForPinUser, accessToken);

    let userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.roles).to.deep.equalInAnyOrder([pinUserRole, citizenRole, dynamicRoleNameForPinUser]);

    I.resetRequestInterception();
});