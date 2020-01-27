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
let serviceRoles;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    userId = uuid.v4();
    randomUserLastName = randomData.getRandomUserName();
    randomUserFirstName = randomData.getRandomUserName();
    currentUserLastName = randomData.getRandomUserName();
    currentUserFirstName = randomData.getRandomUserName();
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    previousUserEmail = 'user.' + randomData.getRandomEmailAddress();
    currentUserEmail = 'user.' + randomData.getRandomEmailAddress();

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

    await I.registerUserWithId(accessToken, previousUserEmail, randomUserFirstName, randomUserLastName, userId, serviceName + "_assignable");
    await I.registerUserWithId(accessToken, currentUserEmail, currentUserFirstName, currentUserLastName, userId, serviceName + "_assignable")
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional multiple users can be registered with same uuid but the previous user will be assigned with auto generated uuid upon activation', async (I) => {
    I.wait(5);

    const responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    const currentUserUrl = await I.extractUrl(currentUserEmail);

    I.amOnPage(currentUserUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    userFirstNames.push(currentUserFirstName);

    const responseAfterCurrentUserActivation = await I.getUserById(userId, accessToken);

    expect(responseAfterCurrentUserActivation.id).to.equal(userId);
    expect(responseAfterCurrentUserActivation.active).to.equal(true);
    expect(responseAfterCurrentUserActivation.forename).to.equal(currentUserFirstName);
    expect(responseAfterCurrentUserActivation.surname).to.equal(currentUserLastName);
    expect(responseAfterCurrentUserActivation.email).to.equal(currentUserEmail);
    expect(responseAfterCurrentUserActivation.roles).to.eql([serviceName + "_assignable"]);

    const previousUserUrl = await I.extractUrl(previousUserEmail);

    I.amOnPage(previousUserUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    userFirstNames.push(randomUserFirstName);

    const responseAfterPreviousUserActivation = await I.getUserByEmail(previousUserEmail);
    expect(responseAfterPreviousUserActivation.id).to.not.equal(userId);
    expect(responseAfterPreviousUserActivation.active).to.equal(true);
    expect(responseAfterPreviousUserActivation.forename).to.equal(randomUserFirstName);
    expect(responseAfterPreviousUserActivation.surname).to.equal(randomUserLastName);
    expect(responseAfterPreviousUserActivation.email).to.equal(previousUserEmail);
});
