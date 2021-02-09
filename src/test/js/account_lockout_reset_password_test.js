const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('When I am locked out of my account, resetting my password unlocks it');

let citizenEmail;
let userFirstNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async ({ I }) => {
    const randomUserFirstName = randomData.getRandomUserName();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);

    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @unlock My user account is unlocked when I reset my password - citizen', async ({ I }) => {
    I.lockAccount(citizenEmail, serviceName);
    I.click('reset your password');
    I.waitForText('Reset your password');
    I.fillField('#email', citizenEmail);
    I.click('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(citizenEmail);
    const activationParams = resetPasswordUrl.match(/passwordReset\?(.*)/)[1];
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/passwordReset?${activationParams}`);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`);
    I.click('Sign in to your account');
    I.waitInUrl('/login');
    I.waitForText('Sign in or create an account');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', 'Passw0rd1234');
    I.scrollPageToBottom();
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});
// NOTE: Retrying this scenario is problematic.