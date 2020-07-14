const testData = require('./config/test_data');
const randomData = require('./shared/random_data');
const Welsh = require('./shared/welsh_constants');

Feature('Stale user login');

let randomUserFirstName;
let staleUserEmail;
let staleUserEmailWelsh;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async(I) => {

    randomUserFirstName = randomData.getRandomUserName();
    staleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    staleUserEmailWelsh = 'staleuser.' + randomData.getRandomEmailAddress();
    const token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_beta", 'beta description', '', token);
    const serviceBetaRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_admin", 'admin description', serviceBetaRole, token);
    const serviceAdminRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_super", 'super description', serviceAdminRole, token);
    const serviceSuperRole = response.name;
    const serviceRoles = [serviceBetaRole, serviceAdminRole, serviceSuperRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceBetaRole, token);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(staleUserEmail, randomUserFirstName + 'StaleUser', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUser');
    await I.retireStaleUser(staleUserEmail);

    await I.createUserWithRoles(staleUserEmailWelsh, randomUserFirstName + 'StaleUserWelsh', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUserWelsh');
    await I.retireStaleUser(staleUserEmailWelsh);
});

AfterSuite(async(I) => {
    I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @staleUserLogin Stale user login journey', async(I) => {
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h2');
    I.fillField('#username', staleUserEmail);
    I.fillField('#password', testData.PASSWORD);
    I.click('Sign in');
    I.wait(5);
    I.waitForText('You need to reset your password', 20, 'h2');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.', 20);
    const reRegistrationUrl = await I.extractUrl(staleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', testData.PASSWORD);
    I.fillField('#password2', testData.PASSWORD);
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.');

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h2');
    I.fillField('#username', staleUserEmail);
    I.fillField('#password', testData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});


Scenario('@functional @staleUserLogin @Welsh Stale user login journey in welsh', async(I) => {
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn, 20, 'h2');
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', testData.PASSWORD);
    I.click(Welsh.signIn);
    I.wait(5);
    I.waitForText(Welsh.youNeedToResetYourPassword, 20, 'h2');
    I.waitForText(Welsh.staleUserErrorMessage, 20);
    const reRegistrationUrl = await I.extractUrl(staleUserEmailWelsh);
    I.amOnPage(reRegistrationUrl);
    I.waitForText(Welsh.createAPassword, 20, 'h1');
    I.fillField('#password1', testData.PASSWORD);
    I.fillField('#password2', testData.PASSWORD);
    I.click(Welsh.continueBtn);
    I.waitForText(Welsh.passwordChanged, 20, 'h1');
    I.waitForText(Welsh.youCanNowSignInWithYourNewPassword);

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signIn, 20, 'h2');
    I.fillField('#username', staleUserEmailWelsh);
    I.fillField('#password', testData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.signIn);
    I.waitForText(testData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

