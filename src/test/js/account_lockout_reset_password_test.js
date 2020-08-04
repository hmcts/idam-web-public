const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('When I am locked out of my account, resetting my password unlocks it');

let citizenEmail;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    const randomUserFirstName = randomData.getRandomUserName();
    const adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

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
    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName + 'Admin');
    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @unlock My user account is unlocked when I reset my password - citizen', async (I) => {
    I.lockAccount(citizenEmail, serviceName);
    I.click('reset your password');
    I.saveScreenshot('reset-password.png');
    I.seeVisualDiff('reset-password.png', {tolerance: 6, prepareBaseImage: false});
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', citizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const resetPasswordUrl = await I.extractUrl(citizenEmail);
    const activationParams = resetPasswordUrl.match(/passwordReset\?(.*)/)[1];
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/passwordReset?${activationParams}`);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.');
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`);
    I.click('Sign in to your account');
    I.waitInUrl('/login', 180);
    I.waitForText('Sign in or create an account', 20, 'h1');
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