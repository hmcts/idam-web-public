var TestData = require('./config/test_data');

Feature('I am able to reset my password');

let adminEmail;
let randomUserLastName;
let citizenEmail;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const serviceRedirectUri = "https://idam.testservice.gov.uk";

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    citizenEmail = 'citizen.' + randomUserLastName + testMailSuffix;
    otherCitizenEmail = 'other.' + randomUserLastName + testMailSuffix;
    plusCitizenEmail = 'plus.' + randomUserLastName + "+extra" + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(serviceName + "_beta", 'beta description', '', token);
    await I.createRole(serviceName + "_admin", 'admin description', serviceName + "_beta", token);
    await I.createRole(serviceName + "_super", 'super description', serviceName + "_admin", token);
    var serviceRoles = [serviceName + "_beta", serviceName + "_admin", serviceName + "_super"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_admin", "IDAM_ADMIN_USER"]);
    await I.createUserWithRoles(citizenEmail, 'Citizen', ["citizen"]);
    await I.createUserWithRoles(otherCitizenEmail, 'Citizen', ["citizen"]);
    await I.createUserWithRoles(plusCitizenEmail, 'Citizen', ["citizen"]);

});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteUser(adminEmail),
     I.deleteUser(citizenEmail),
     I.deleteUser(otherCitizenEmail),
     I.deleteUser(plusCitizenEmail),
     I.deleteService(serviceName)
    ]);
});

Scenario('@functional @resetpass As a citizen user I can reset my password', async (I) => {
    var loginPage = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName + '&state=';
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', citizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(2);
    var resetPasswordUrl = await I.extractUrl(citizenEmail);
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
    I.waitForText('https://idam.testservice.gov.uk/');
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});
 // NOTE: Retrying this scenario is problematic.

Scenario('@functional @resetpass As a citizen user with a plus email I can reset my password', async (I) => {
    var loginPage = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName + '&state=';
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', plusCitizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(2);
    var resetPasswordUrl = await I.extractUrl(plusCitizenEmail);
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
    I.waitForText('https://idam.testservice.gov.uk/');
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @resetpass Validation displayed when I try to reset my password with a blacklisted/invalid password', async (I) => {
    var loginPage = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName + '&state=';
    I.amOnPage(loginPage);
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.click('Forgotten password?');
    I.waitForText('Reset your password', 20, 'h1');
    I.fillField('#email', otherCitizenEmail);
    I.click('Submit');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(2);
    var resetPasswordUrl = await I.extractUrl(otherCitizenEmail);
    I.amOnPage(resetPasswordUrl);
    I.waitForText('Create a new password', 20, 'h1');
    I.seeTitleEquals('Reset Password - HMCTS Access');
    I.fillField('password1', 'Passw0rd');
    I.fillField('password2', 'Passw0rd');
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("This password is used often and is not secure. Create a more secure password");
    I.fillField('password1', 'passwordidamtest');
    I.fillField('password2', 'passwordidamtest');
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see('Your password did not have all of the required characters.');
    I.see('Enter a password that includes at least 8 characters, a capital letter, a lowercase letter and a number.');
    I.fillField('password1', 'Lincoln1');
    I.fillField('password2', 'Lincoln1');
    I.click('Continue');
    I.wait(2);
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("This password is used often and is not secure. Create a more secure password");

}).retry(TestData.SCENARIO_RETRY_LIMIT);