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
let apiAuthToken;
let accessToken;
let userId;
let serviceRoles;
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

    apiAuthToken = await I.getAuthToken();
    let response;
    response = await I.createRole(serviceName + "_assignable", 'assignable role', '', apiAuthToken);
    const assignableRole = response.name;
    response = await I.createRole(serviceName + "_usrReg", 'user reg role', serviceName + "_assignable", apiAuthToken);
    const userRegRole = response.name;
    serviceRoles = [userRegRole, assignableRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", apiAuthToken, 'create-user manage-user');
    serviceNames.push(serviceName);
    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [serviceName + "_usrReg"]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, TestData.PASSWORD);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user manage-user', base64);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    await I.registerUserWithId(accessToken, userEmail, randomUserFirstName, randomUserLastName, userId, serviceName + "_assignable")
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional user registration pending status and post activation redirect url test', async (I) => {
    I.wait(10);

    const responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    I.wait(10);
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
    expect(responseAfterActivation.roles).to.eql([serviceName + "_assignable"]);

    I.resetRequestInterception();
});
