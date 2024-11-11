const testData = require('./config/test_data');
const randomData = require('./shared/random_data');
const Welsh = require('./shared/welsh_constants');
const TestData = require("./config/test_data");

Feature('Stale user login');

let serviceNames = [];
let token;
const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async({ I }) => {
    token = await I.getToken();
    const scopes = ['openid', 'profile', 'roles'];

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [], token, scopes, []);
    serviceNames.push(serviceName);

    I.wait(0.5);

});

Scenario('@functional @staleUserLogin Stale user login journey', async({ I }) => {

    let randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    let staleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(token, staleUserEmail, userPassword, randomUserFirstName + 'StaleUser', ["citizen"]);
    await I.retireStaleUser(staleUserEmail);

    const newPassword = randomData.getRandomUserPassword();
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', staleUserEmail.toUpperCase());
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.');
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(token, staleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password');
    I.fillField('#password1', newPassword);
    I.fillField('#password2', newPassword);
    I.click('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', staleUserEmail.toUpperCase());
    I.fillField('#password', newPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});


Scenario('@functional @staleUserLogin @Welsh Stale user login journey in welsh', async({ I }) => {

    let randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    let staleUserEmailWelsh = 'staleuser.' + randomData.getRandomEmailAddress();

    await I.createUserUsingTestingSupportService(token, staleUserEmailWelsh, userPassword, randomUserFirstName + 'StaleUserWelsh', ["citizen"]);
    await I.retireStaleUser(staleUserEmailWelsh);

    const newPassword = randomData.getRandomUserPassword();
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn);
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', userPassword);
    I.click(Welsh.signIn);
    I.waitForText(Welsh.staleUserErrorMessage);
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(token, staleUserEmailWelsh);
    I.amOnPage(reRegistrationUrl);
    I.waitForText(Welsh.createAPassword);
    I.fillField('#password1', newPassword);
    I.fillField('#password2', newPassword);
    I.click(Welsh.continueBtn);
    I.waitForText(Welsh.passwordChanged);
    I.waitForText(Welsh.youCanNowSignInWithYourNewPassword);

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn);
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', newPassword);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.signIn);
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

