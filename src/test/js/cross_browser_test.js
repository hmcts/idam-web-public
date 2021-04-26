const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Users can create account, sign in and reset password');

let randomUserFirstName;
let citizenUserSelfRegistrationEmail;
let citizenUserLoginEmail;
let citizenUserPasswordResetEmail;
let userFirstNames = [];
let serviceNames = [];
let randomUserLastName;

const serviceName = randomData.getRandomServiceName();
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;
const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName();
    randomUserLastName = randomData.getRandomUserName();
    citizenUserSelfRegistrationEmail = 'citizenSelfreg' + randomData.getRandomEmailAddress();
    citizenUserLoginEmail = 'citizenLogin' + randomData.getRandomEmailAddress();
    citizenUserPasswordResetEmail = 'citizenPasswordReset' + randomData.getRandomEmailAddress();

    await I.createServiceData(serviceName, serviceClientSecret);
    serviceNames.push(serviceName);

    userFirstNames.push(randomUserFirstName + 'citizenSelfreg');
    await I.createUserWithRoles(citizenUserLoginEmail, userPassword, randomUserFirstName + 'citizenLogin', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'citizenLogin');
    await I.createUserWithRoles(citizenUserPasswordResetEmail, userPassword, randomUserFirstName + 'citizenPasswordReset', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'citizenPasswordReset');
});

AfterSuite(async ({ I }) => {
     return I.deleteAllTestData(randomData.TEST_BASE_PREFIX)
});

Scenario('@crossbrowser Citizen user self registration', async ({ I }) => {
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName + 'citizenSelfreg');
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenUserSelfRegistrationEmail);
    I.click("Continue");
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(citizenUserSelfRegistrationEmail);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click('Continue');
    I.waitForText('Account created');
});

Scenario('@crossbrowser Citizen user login', async ({ I }) => {
    I.amOnPage(loginPage);
    I.waitForText('Sign in');
    I.fillField('#username', citizenUserLoginEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.waitForInvisible('#username', 20);
});

Scenario('@crossbrowser Citizen user password reset', async ({ I }) => {
    const resetPassword = randomData.getRandomUserPassword();

    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.click('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', citizenUserPasswordResetEmail);
    I.click('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(citizenUserPasswordResetEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.click('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
});
