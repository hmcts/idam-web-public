const testData = require('./config/test_data');
const randomData = require('./shared/random_data');
const Welsh = require('./shared/welsh_constants');

Feature('Stale user login');

let randomUserFirstName;
let staleUserEmail;
let staleUserEmailWelsh;
let userFirstNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async({ I }) => {

    randomUserFirstName = randomData.getRandomUserName();
    staleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    staleUserEmailWelsh = 'staleuser.' + randomData.getRandomEmailAddress();

    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);

    await I.createUserWithRoles(staleUserEmail, randomUserFirstName + 'StaleUser', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUser');
    await I.retireStaleUser(staleUserEmail);

    await I.createUserWithRoles(staleUserEmailWelsh, randomUserFirstName + 'StaleUserWelsh', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUserWelsh');
    await I.retireStaleUser(staleUserEmailWelsh);
});

AfterSuite(async({ I }) => {
    I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @staleUserLogin Stale user login journey', async({ I }) => {
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', staleUserEmail.toUpperCase());
    I.fillField('#password', testData.PASSWORD);
    I.click('Sign in');
    I.waitForText('You need to reset your password');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.');
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(staleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password');
    I.fillField('#password1', testData.PASSWORD);
    I.fillField('#password2', testData.PASSWORD);
    I.click('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', staleUserEmail.toUpperCase());
    I.fillField('#password', testData.PASSWORD);
    I.wait(5);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});


Scenario('@functional @staleUserLogin @Welsh Stale user login journey in welsh', async({ I }) => {
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn);
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', testData.PASSWORD);
    I.click(Welsh.signIn);
    I.waitForText(Welsh.youNeedToResetYourPassword);
    I.waitForText(Welsh.staleUserErrorMessage);
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(staleUserEmailWelsh);
    I.amOnPage(reRegistrationUrl);
    I.waitForText(Welsh.createAPassword);
    I.fillField('#password1', testData.PASSWORD);
    I.fillField('#password2', testData.PASSWORD);
    I.click(Welsh.continueBtn);
    I.waitForText(Welsh.passwordChanged);
    I.waitForText(Welsh.youCanNowSignInWithYourNewPassword);

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn);
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', testData.PASSWORD);
    I.wait(5);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.signIn);
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

