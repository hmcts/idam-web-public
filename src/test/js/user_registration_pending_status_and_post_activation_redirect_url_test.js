const chai = require('chai');
const {expect} = chai;
const uuid = require('uuid');
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('user registration pending status and post activation redirect url test');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let userEmail;
let accessToken;
let userId;
let assignableRole;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];
let accessTokenClientSecret;

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    userId = uuid.v4();
    randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    userEmail = 'user.' + randomData.getRandomEmailAddress();

    const apiAuthToken = await I.getAuthToken();
    assignableRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_assignable", 'assignable role', '', apiAuthToken);
    let userRegRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_usrReg", 'user reg role', assignableRole.id, apiAuthToken);

    let serviceRoleNames = [assignableRole.name, userRegRole.name];
    let serviceRoleIds = [assignableRole.id, userRegRole.id];
    roleNames.push(serviceRoleNames);

    await I.createServiceWithRoles(serviceName, serviceClientSecret, serviceRoleIds, '', apiAuthToken, 'create-user manage-user');
    serviceNames.push(serviceName);

    I.wait(0.5);

    accessTokenClientSecret = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, adminEmail, userPassword, randomUserFirstName + 'Admin', [userRegRole.name]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, userPassword);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user manage-user', base64);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    await I.registerUserWithId(accessToken, userEmail, randomUserFirstName, randomUserLastName, userId, assignableRole.name)
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional user registration pending status and post activation redirect url test', async ({ I }) => {
    const responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    const url = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, userEmail);

    I.amOnPage(url);
    I.waitForText('Create a password');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click('Continue');
    I.waitForText('Account created');
    userFirstNames.push(randomUserFirstName);
    I.waitForText('You can now sign in to your account.');
    I.waitForText('Continue');
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);

    const responseAfterActivation = await I.getUserById(userId, accessToken);
    expect(responseAfterActivation.id).to.equal(userId);
    expect(responseAfterActivation.active).to.equal(true);
    expect(responseAfterActivation.forename).to.equal(randomUserFirstName);
    expect(responseAfterActivation.surname).to.equal(randomUserLastName);
    expect(responseAfterActivation.email).to.equal(userEmail);
    expect(responseAfterActivation.roles).to.eql([assignableRole.name]);

    I.resetRequestInterception();
});
