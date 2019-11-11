const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('I am able to reset my password');

let adminEmail;
let randomUserFirstName;
let citizenEmail;
let otherCitizenEmail;
let plusCitizenEmail;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();
const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=`;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    otherCitizenEmail = 'other.' + randomData.getRandomEmailAddress();
    plusCitizenEmail = 'plus.' + "extra+" + randomData.getRandomEmailAddress();

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
    await I.createUserWithRoles(otherCitizenEmail, randomUserFirstName + 'Other', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Other');
    await I.createUserWithRoles(plusCitizenEmail, randomUserFirstName + 'Plus', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Plus');

});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @resetpass As a citizen user I can reset my password', async (I) => {
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', citizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(10);
    const resetPasswordUrl = await I.extractUrl(citizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.')
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', 'Passw0rd1234');
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});
// NOTE: Retrying this scenario is problematic.

Scenario('@functional @resetpass As a citizen user with a plus email I can reset my password', async (I) => {
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', plusCitizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(10);
    const resetPasswordUrl = await I.extractUrl(plusCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('#password1', 'Passw0rd1234');
    I.fillField('#password2', 'Passw0rd1234');
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.')
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', plusCitizenEmail);
    I.fillField('#password', 'Passw0rd1234');
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass Validation displayed when I try to reset my password with a blacklisted/personal info/invalid password', async (I) => {
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', otherCitizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(10);
    const resetPasswordUrl = await I.extractUrl(otherCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('password1', 'Passw0rd');
    I.fillField('password2', 'Passw0rd');
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Your password is too easy to guess");
    I.fillField('password1', `${randomUserFirstName}6mKjmC`);
    I.fillField('password2', `${randomUserFirstName}6mKjmC`);
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', 'passwordidamtest');
    I.fillField('password2', 'passwordidamtest');
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see('Your password didn\'t have all the required characters');
    I.fillField('password1', 'Lincoln1');
    I.fillField('password2', 'Lincoln1');
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Your password is too easy to guess");

}).retry(TestData.SCENARIO_RETRY_LIMIT);