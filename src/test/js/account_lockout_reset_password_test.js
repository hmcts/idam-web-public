const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('When I am locked out of my account, resetting my password unlocks it');

let citizenEmail;
let userFirstNames = [];
let serviceNames = [];
let testingToken;

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    const randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    testingToken =  await I.getToken();
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,[], testingToken, [], []);
    serviceNames.push(serviceName);

    I.wait(0.5);

    testingToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(testingToken, citizenEmail, userPassword, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');
});

Scenario('@functional @unlock My user account is unlocked when I reset my password - citizen', async ({ I }) => {
    const password = randomData.getRandomUserPassword();
    I.lockAccount(citizenEmail, serviceName);
    await I.runAccessibilityTest();
    I.click('reset your password');
    I.wait(1);
    I.waitForText('Reset your password');
    I.fillField('#email', citizenEmail);
    await I.runAccessibilityTest();
    I.click('Submit');
    I.wait(1);
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(testingToken, citizenEmail);
    const activationParams = resetPasswordUrl.match(/passwordReset\?(.*)/)[1];
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/passwordReset?${activationParams}`);
    I.waitForText('Create a new password');
    await I.runAccessibilityTest();
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    await I.runAccessibilityTest();
    I.click('Continue');
    I.wait(1);
    I.waitForText('Your password has been changed');
    await I.runAccessibilityTest();
    I.see('You can now sign in with your new password.');
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`);
    I.click('Sign in to your account');
    I.wait(1);
    I.waitInUrl('/login');
    I.waitForText('Sign in or create an account');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', password);
    I.scrollPageToBottom();
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.wait(1);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});