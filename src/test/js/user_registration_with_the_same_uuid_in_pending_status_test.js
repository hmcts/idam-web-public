const chai = require('chai');
const {expect} = chai;
const uuid = require('uuid');
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('user registration with the same uuid in pending status');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let previousUserEmail;
let currentUserEmail;
let currentUserLastName;
let currentUserFirstName;
let apiAuthToken;
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
    currentUserLastName = randomData.getRandomUserName(testSuitePrefix);
    currentUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    previousUserEmail = 'user.' + randomData.getRandomEmailAddress();
    currentUserEmail = 'user.' + randomData.getRandomEmailAddress();

    apiAuthToken = await I.getAuthToken();
    assignableRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix)  + "_assignable", 'assignable role', '', apiAuthToken);
    let userRegRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix)  + "_usrReg", 'user reg role', assignableRole.id, apiAuthToken);

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

    await I.registerUserWithId(accessToken, previousUserEmail, randomUserFirstName, randomUserLastName, userId, assignableRole.name);
    await I.registerUserWithId(accessToken, currentUserEmail, currentUserFirstName, currentUserLastName, userId, assignableRole.name)
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional multiple users can be registered with same uuid but the previous user will be told their account is already active', async ({ I }) => {
    const responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    const currentUserUrl = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, currentUserEmail);

    I.amOnPage(currentUserUrl);
    I.waitForText('Create a password');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click('Continue');
    I.waitForText('Account created');
    userFirstNames.push(currentUserFirstName);

    const responseAfterCurrentUserActivation = await I.getUserById(userId, accessToken);

    expect(responseAfterCurrentUserActivation.id).to.equal(userId);
    expect(responseAfterCurrentUserActivation.active).to.equal(true);
    expect(responseAfterCurrentUserActivation.forename).to.equal(currentUserFirstName);
    expect(responseAfterCurrentUserActivation.surname).to.equal(currentUserLastName);
    expect(responseAfterCurrentUserActivation.email).to.equal(currentUserEmail);
    expect(responseAfterCurrentUserActivation.roles).to.eql([assignableRole.name]);

    const previousUserUrl = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, previousUserEmail);

    I.amOnPage(previousUserUrl);
    I.waitForText('Your account is already activated.');

});
