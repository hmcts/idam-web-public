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
let testingToken;

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;
const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    citizenUserLoginEmail = 'citizenLogin' + randomData.getRandomEmailAddress();
    testingToken =  await I.getToken();
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,'', testingToken, [], []);    serviceNames.push(serviceName);

    I.wait(0.5);

    testingToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(testingToken, citizenUserLoginEmail, userPassword, randomUserFirstName + 'citizenLogin', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'citizenSelfreg');
    userFirstNames.push(randomUserFirstName + 'citizenLogin');
    userFirstNames.push(randomUserFirstName + 'citizenPasswordReset');
});

Scenario('@crossbrowser Citizen user self registration', async ({ I }) => {
    citizenUserSelfRegistrationEmail = 'citizenSelfreg' + randomData.getRandomEmailAddress();
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName + 'citizenSelfreg');
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenUserSelfRegistrationEmail);
    I.click("Continue");
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(testingToken, citizenUserSelfRegistrationEmail);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click('Continue');
    I.waitForText('Account created');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@crossbrowser Citizen user login', async ({ I }) => {
    I.amOnPage(loginPage);
    I.waitForText('Sign in');
    I.fillField('#username', citizenUserLoginEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.waitForInvisible('#username', 20);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@crossbrowser Citizen user password reset', async ({ I }) => {
    citizenUserPasswordResetEmail = 'citizenPasswordReset' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(testingToken, citizenUserPasswordResetEmail, userPassword, randomUserFirstName + 'citizenPasswordReset', ["citizen"]);
    const resetPassword = randomData.getRandomUserPassword();

    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.click('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', citizenUserPasswordResetEmail);
    I.click('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(testingToken, citizenUserPasswordResetEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.click('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
}).retry(TestData.SCENARIO_RETRY_LIMIT);
