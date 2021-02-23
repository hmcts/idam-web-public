const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Users can create account, sign in and reset password');

let randomUserFirstName;
let citizenEmail;
let userFirstNames = [];
let serviceNames = [];
let randomUserLastName;

const serviceName = randomData.getRandomServiceName();

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    randomUserLastName = randomData.getRandomUserName();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);

    userFirstNames.push(randomUserFirstName);
});

AfterSuite(async (I) => {
     return I.deleteAllTestData(randomData.TEST_BASE_PREFIX)
});

Scenario('@crossbrowser Idam Web public cross browser tests', async (I) => {

    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    // create account
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmail);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const userActivationUrl = await I.extractUrl(citizenEmail);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');

    // login
    I.amOnPage(loginPage);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(5);
    I.dontSee('Sign in');

    //Reset password
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', citizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const resetPasswordUrl = await I.extractUrl(citizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.');
});