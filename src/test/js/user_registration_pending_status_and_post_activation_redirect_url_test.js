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

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    userId = uuid.v4();
    randomUserLastName = randomData.getRandomUserName();
    randomUserFirstName = randomData.getRandomUserName();
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    userEmail = 'user.' + randomData.getRandomEmailAddress();

    const apiAuthToken = await I.getAuthToken();
    assignableRole = await I.createRole(randomData.getRandomRoleName() + "_assignable", 'assignable role', '', apiAuthToken);
    let userRegRole = await I.createRole(randomData.getRandomRoleName() + "_usrReg", 'user reg role', assignableRole.id, apiAuthToken);

    let serviceRoleNames = [assignableRole.name, userRegRole.name];
    let serviceRoleIds = [assignableRole.id, userRegRole.id];
    roleNames.push(serviceRoleNames);

    await I.createServiceWithRoles(serviceName, serviceRoleIds, '', apiAuthToken, 'create-user manage-user');
    serviceNames.push(serviceName);

    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [userRegRole.name]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, TestData.PASSWORD);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user manage-user', base64);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    await I.registerUserWithId(accessToken, userEmail, randomUserFirstName, randomUserLastName, userId, assignableRole.name)
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional user registration pending status and post activation redirect url test', async (I) => {
    I.wait(5);

    const responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    const url = await I.extractUrl(userEmail);

    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    userFirstNames.push(randomUserFirstName);
    I.waitForText('You can now sign in to your account.', 20);
    I.waitForText('Continue', 20);
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
