const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('I am able to reset my password');

let citizenEmail;
let diffCaseCitizenEmail;
let otherCitizenEmail;
let plusCitizenEmail;
let apostropheCitizenEmail;
let staleUserEmail;
let idamServiceAccountUserEmail;
let userFirstNames = [];
let serviceNames = [];
let accessToken;

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();
const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=`;

BeforeSuite(async ({ I }) => {
    accessToken = await I.getToken();
    const scopes = ['openid', 'profile', 'roles'];

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [], accessToken, scopes, []);
    serviceNames.push(serviceName);

    I.wait(0.5);

});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional @resetpass As a citizen user I can reset my password', async ({ I }) => {

    let citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, citizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Citizen', ["citizen"]);

    const resetPassword = randomData.getRandomUserPassword();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', citizenEmail);
    await I.runAccessibilityTest();
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    await I.runAccessibilityTest();
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, citizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    await I.runAccessibilityTest();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', resetPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});
 //NOTE: Retrying this scenario is problematic.

Scenario('@functional @resetpasswithdiffcaseemail As a citizen user I can reset my password with diff case email address', async ({ I }) => {
    const resetPassword = randomData.getRandomUserPassword();
    let diffCaseCitizenEmail = 'diffcase.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, diffCaseCitizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'diffcase', ["citizen"]);

    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', diffCaseCitizenEmail.toUpperCase());
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, diffCaseCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', diffCaseCitizenEmail);
    I.fillField('#password', resetPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass As a citizen user with a plus email I can reset my password', async ({ I }) => {

    let plusCitizenEmail = `plus.extra+${randomData.getRandomEmailAddress()}`;
    await I.createUserUsingTestingSupportService(accessToken, plusCitizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Plus', ["citizen"]);
    const resetPassword = randomData.getRandomUserPassword();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', plusCitizenEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, plusCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', plusCitizenEmail);
    I.fillField('#password', resetPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass As a citizen user with an apostrophe email I can reset my password', async ({ I }) => {

    let apostropheCitizenEmail = "apostrophe.o'test" + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, apostropheCitizenEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Apostrophe', ["citizen"]);

    const resetPassword = randomData.getRandomUserPassword();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', apostropheCitizenEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, apostropheCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', apostropheCitizenEmail);
    I.fillField('#password', resetPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass @passwordvalidation Validation displayed when I try to reset my password with a blacklisted/invalid password', async ({ I }) => {

    let randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);

    let otherCitizenEmail = 'other.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, otherCitizenEmail, userPassword, randomUserFirstName + 'Other', ["citizen"]);

    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', otherCitizenEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, otherCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('password1', 'Passw0rd');
    I.fillField('password2', 'Passw0rd');
    I.clickWithWait('Continue');
    I.waitForText('There is a problem');
    I.see("Your password is too easy to guess");
    await I.runAccessibilityTest();
    I.fillField('password1', `${randomUserFirstName}Other6mKjmC`);
    I.fillField('password2', `${randomUserFirstName}Other6mKjmC`);
    I.clickWithWait('Continue');
    I.waitForText('There is a problem');
    I.see("Do not include your name or email in your password");
    await I.runAccessibilityTest();
    I.fillField('password1', `${otherCitizenEmail}3ksTys`);
    I.fillField('password2', `${otherCitizenEmail}3ksTys`);
    I.clickWithWait('Continue');
    I.waitForText('There is a problem');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', 'passwordidamtest');
    I.fillField('password2', 'passwordidamtest');
    I.clickWithWait('Continue');
    I.waitForText('There is a problem');
    I.see('Your password didn\'t have all the required characters');
    await I.runAccessibilityTest();
    I.fillField('password1', 'Lincoln1');
    I.fillField('password2', 'Lincoln1');
    I.clickWithWait('Continue');
    I.waitForText('There is a problem');
    I.see("Your password is too easy to guess");

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @resetpass As a citizen user I can reset my password with repeated special characters', async ({ I }) => {

    let randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    let specialCharacterPassword = 'New&&&$$$%%%<>234';
    let specialcharPwdResetCitizenEmail = 'specialcharpwd.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, specialcharPwdResetCitizenEmail, userPassword, randomUserFirstName + 'specialcharpwd', ["citizen"]);

    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', specialcharPwdResetCitizenEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, specialcharPwdResetCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', specialCharacterPassword);
    I.fillField('#password2', specialCharacterPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', specialcharPwdResetCitizenEmail);
    I.fillField('#password', specialCharacterPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});


Scenario('@functional @staleuserresetpass As a stale user, I can reset my password', async ({ I }) => {

    let staleUserEmail = 'stale.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, staleUserEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'Stale', ["citizen"]);
    await I.retireStaleUser(staleUserEmail)

    const resetPassword = randomData.getRandomUserPassword();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', staleUserEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, staleUserEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', staleUserEmail);
    I.fillField('#password', resetPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass @idamserviceaccount As a idam service account user I can reset my password', async ({ I }) => {
    let idamServiceAccountUserEmail = 'idamserviceaccount.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, idamServiceAccountUserEmail, userPassword, randomData.getRandomUserName(testSuitePrefix) + 'idamserviceaccount', ["idam-service-account"]);

    const resetPassword = randomData.getRandomUserPassword();
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account');
    I.clickWithWait('Forgotten password?');
    I.waitForText('Reset your password');
    I.fillField('#email', idamServiceAccountUserEmail);
    I.clickWithWait('Submit');
    I.waitForText('Check your email');
    const resetPasswordUrl = await I.extractUrlFromNotifyEmail(accessToken, idamServiceAccountUserEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password');
    I.seeTitleEquals('Reset Password - HMCTS Access - GOV.UK');
    I.fillField('#password1', resetPassword);
    I.fillField('#password2', resetPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
});
