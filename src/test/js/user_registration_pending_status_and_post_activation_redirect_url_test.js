const chai = require('chai');
const {expect} = chai;
const uuid = require('uuid');

Feature('user registration pending status and post activation redirect url test');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let userEmail;
let apiAuthToken;
let accessToken;
let userId;
let serviceRoles;

const serviceName = 'TEST_SERVICE_' + Date.now();
const serviceManageUser = 'TEST_SERVICE_MANAGE_USER_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    userId = uuid.v4();
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    userEmail = 'user.' + randomUserLastName + testMailSuffix;

    apiAuthToken = await I.getAuthToken();
    await I.createRole(serviceName + "_assignable", 'assignable role', '', apiAuthToken);
    await I.createRole(serviceName + "_usrReg", 'user reg role', serviceName + "_assignable", apiAuthToken);

    serviceRoles = [serviceName + "_usrReg", serviceName + "_assignable"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", apiAuthToken, 'create-user manage-user');
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_usrReg"]);

    var base64 = await I.getBase64(adminEmail, password);
    var code = await I.getAuthorizeCode(serviceName, redirectUri, 'create-user manage-user', base64);
    accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);

    await I.registerUserWithId(accessToken, userEmail, randomUserFirstName, randomUserLastName, userId, serviceName + "_assignable")
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteUser(userEmail),
        I.deleteUser(adminEmail),
        I.deleteService(serviceManageUser),
        I.deleteService(serviceName)
    ]);
});

Scenario('@functional user registration pending status and post activation redirect url test', async (I) => {
    I.wait(10);

    let responseBeforeActivation = await I.getUserById(userId, accessToken);
    expect(responseBeforeActivation.id).to.equal(userId);
    expect(responseBeforeActivation.pending).to.equal(true);

    let url = await I.extractUrl(userEmail);

    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.waitForText('You can now sign in to your account.', 20);
    I.waitForText('Continue', 20);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitUrlEquals('https://idam.testservice.gov.uk/', 60);

    let responseAfterActivation = await I.getUserById(userId, accessToken);
    expect(responseAfterActivation.id).to.equal(userId);
    expect(responseAfterActivation.active).to.equal(true);
    expect(responseAfterActivation.forename).to.equal(randomUserFirstName);
    expect(responseAfterActivation.surname).to.equal(randomUserLastName);
    expect(responseAfterActivation.email).to.equal(userEmail);
    expect(responseAfterActivation.roles).to.eql([serviceName + "_assignable"]);

   I.resetRequestInterception();

});
