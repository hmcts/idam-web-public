const chai = require('chai');
const {expect} = chai;
const uuid = require('uuid');

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

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    userId = uuid.v4();
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    currentUserLastName = await I.generateRandomText();
    currentUserFirstName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    previousUserEmail = 'user.' + randomUserLastName + testMailSuffix;
    currentUserEmail = 'user.' + currentUserLastName + testMailSuffix;

    apiAuthToken = await I.getAuthToken();
    await I.createRole(serviceName + "_assignable", 'assignable role', '', apiAuthToken);
    await I.createRole(serviceName + "_usrReg", 'user reg role', serviceName + "_assignable", apiAuthToken);

    serviceRoles = [serviceName + "_usrReg", serviceName + "_assignable"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", apiAuthToken, 'create-user manage-user');
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_usrReg"]);

    var base64 = await I.getBase64(adminEmail, password);
    var code = await I.getAuthorizeCode(serviceName, redirectUri, 'create-user manage-user', base64);
    accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);

    await I.registerUserWithId(accessToken, previousUserEmail, randomUserFirstName, randomUserLastName, userId, serviceName + "_assignable");
    await I.registerUserWithId(accessToken, currentUserEmail, currentUserFirstName, currentUserLastName, userId, serviceName + "_assignable")
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteUser(previousUserEmail),
        I.deleteUser(adminEmail),
        I.deleteService(serviceName)
    ]);
});

Scenario('@functional multiple users can be registered with same uuid but the previous user will be assigned with auto generated uuid upon activation', async (I) => {
    I.wait(10);

    let responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    let currentUserUrl = await I.extractUrl(currentUserEmail);

    I.amOnPage(currentUserUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');

    let responseAfterCurrentUserActivation = await I.getUserById(userId, accessToken);

    expect(responseAfterCurrentUserActivation.id).to.equal(userId);
    expect(responseAfterCurrentUserActivation.active).to.equal(true);
    expect(responseAfterCurrentUserActivation.forename).to.equal(currentUserFirstName);
    expect(responseAfterCurrentUserActivation.surname).to.equal(currentUserLastName);
    expect(responseAfterCurrentUserActivation.email).to.equal(currentUserEmail);
    expect(responseAfterCurrentUserActivation.roles).to.eql([serviceName + "_assignable"]);

    let previousUserUrl = await I.extractUrl(previousUserEmail);

    I.amOnPage(previousUserUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');

    let responseAfterPreviousUserActivation = await I.getUserByEmail(previousUserEmail);
    expect(responseAfterPreviousUserActivation.id).to.not.equal(userId);
    expect(responseAfterPreviousUserActivation.active).to.equal(true);
    expect(responseAfterPreviousUserActivation.forename).to.equal(randomUserFirstName);
    expect(responseAfterPreviousUserActivation.surname).to.equal(randomUserLastName);
    expect(responseAfterPreviousUserActivation.email).to.equal(previousUserEmail);
});
