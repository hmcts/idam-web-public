var TestData = require('./config/test_data');
var assert = require('assert');

Feature('Self Registration');

const now = Date.now();
const serviceName = 'TEST_SERVICE_' + now;
const emailSuffix = '@mailtest.gov.uk';
const citizenEmail = 'citizen.' + now + emailSuffix;
const parameters = '?redirect_uri=https://idam.testservice.gov.uk&client_id=';

BeforeSuite(async(I) => {
    await I.createServiceData(serviceName);
    await I.createUserWithRoles(citizenEmail, 'Citizen', ["citizen"]);

});

AfterSuite(async(I) => {
    return Promise.all([
        I.deleteUser(citizenEmail),
        I.deleteService(serviceName)
    ]);
});

Scenario('@functional @selfregister User Validation errors', (I) => {

    I.amOnPage(TestData.WEB_PUBLIC_URL + '/users/selfRegister' + parameters + serviceName);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');

    I.click("Continue");

    I.waitForText('Information is missing or invalid', 20, 'h2');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.wait(5);
    I.see('Your email address is invalid');
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.click('Continue');
    I.wait(5);
    I.see('Your first name is invalid:');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid:');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.waitForText('Sign in', 20, 'h1');
    I.see('Sign in');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister Account already created', async (I) => {

    I.amOnPage(TestData.WEB_PUBLIC_URL + '/users/selfRegister'+ parameters + serviceName);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', 'Citizen');
    I.fillField('lastName', 'User');
    I.fillField('email', citizenEmail);
    I.click("Continue");

    I.waitForText('Check your email', 20, 'h1');

    I.wait(2);
    let emailResponse = await I.getEmail(citizenEmail);
    assert.equal('You already have an account', emailResponse.subject);

});

Scenario('@functional @selfregister I can self register', async (I) => {

    const email = 'test_citizen.' + now + emailSuffix;
    const loginPage = TestData.WEB_PUBLIC_URL + '/login' + parameters + serviceName + '&state=selfreg';

    I.amOnPage(TestData.WEB_PUBLIC_URL + '/users/selfRegister' + parameters + serviceName);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', 'Citizen');
    I.fillField('lastName', 'User');
    I.fillField('email', email);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    I.wait(2);
    let userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', email);
    I.fillField('#password', 'Passw0rd1234');
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText('https://idam.testservice.gov.uk/');
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});