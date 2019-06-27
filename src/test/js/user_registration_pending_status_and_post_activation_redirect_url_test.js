var TestData = require('./config/test_data');
const chai = require('chai');
const {expect} = chai;
const uuid = require('uuid');

Feature('user registration pending status and post activation redirect url test');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let userEmail;
let apiAuthToken;
let userId;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    userId = uuid.v4();
    console.log("userId: ", userId);
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    userEmail = 'user.' + randomUserLastName + testMailSuffix;

    apiAuthToken = await I.getAuthToken();
    await I.createRole(serviceName + "_assignable", 'assignable role', '', apiAuthToken);
    await I.createRole(serviceName + "_dynUsrReg", 'dynamic user reg role', serviceName + "_assignable", apiAuthToken);

    var serviceRoles = [serviceName + "_dynUsrReg", serviceName + "_assignable"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", apiAuthToken, 'create-user');
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_dynUsrReg"]);

    var base64 = await I.getBase64(adminEmail, password);
    var code = await I.getAuthorizeCode(serviceName, redirectUri, 'create-user', base64);
    var accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);

    await I.registerUserWithId(accessToken, userEmail, randomUserFirstName, randomUserLastName, userId, serviceName + "_assignable")
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteUser(userEmail),
        I.deleteUser(adminEmail),
        I.deleteService(serviceName)
    ]);
});

Scenario('@functional @userPending user registration pending status and post activation redirect url test', async (I) => {
    I.wait(10);

    let responseBeforeActivation = await I.getUserById(userId, apiAuthToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.status).to.equal('pending');

    let url = await I.extractUrl(userEmail);

    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 60, 'h1');
    I.see('You can now sign in to your account.');
    I.click('Continue');

    let currentUrl = await I.getCurrentUrl();
    expect(currentUrl).to.equal("https://idam.testservice.gov.uk");

    let responseAfterActivation = await I.getUserById(userId, apiAuthToken);
    expect(responseAfterActivation.id).to.equal(userId);
    expect(responseAfterActivation.active).to.equal('true');
    expect(responseAfterActivation.forename).to.equal(randomUserFirstName);
    expect(responseAfterActivation.surname).to.equal(randomUserLastName);
    expect(responseAfterActivation.email).to.equal(userEmail);
    expect(responseAfterActivation.roles).to.eql([serviceName + "_assignable"]);

}).retry(TestData.SCENARIO_RETRY_LIMIT);
