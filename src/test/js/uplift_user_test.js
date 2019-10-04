var TestData = require('./config/test_data');

Feature('I am able to uplift a user');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let citizenEmail;
let existingCitizenEmail;
let accessToken;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText() + 'pinępinç';
    randomUserFirstName = await I.generateRandomText() + 'ępinçłpin';
    randomUserName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserName + testMailSuffix;
    citizenEmail = 'citizen.' + randomUserName + testMailSuffix;
    existingCitizenEmail = 'existingcitizen.' + randomUserName + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(serviceName + "_beta", 'beta description', '', token);
    await I.createRole(serviceName + "_admin", 'admin description', serviceName + "_beta", token);
    await I.createRole(serviceName + "_super", 'super description', serviceName + "_admin", token);
    var serviceRoles = [serviceName + "_beta", serviceName + "_admin", serviceName + "_super"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_admin", "IDAM_ADMIN_USER"]);
    await I.createUserWithRoles(existingCitizenEmail, 'Citizen', ["citizen"]);

    var pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    var code = await I.loginAsPin(pinUser.pin, serviceName, redirectUri);
    accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);
});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteUser(adminEmail),
     I.deleteUser(citizenEmail),
     I.deleteService(serviceName)
    ]);
});

Scenario('@functional @upliftvalid User Validation errors', (I) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + '/login/uplift?client_id=' + serviceName + '&redirect_uri=' + redirectUri + '&jwt=' + accessToken);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.click("Continue");
    I.wait(2);
    I.waitForText('Information is missing or invalid', 20, 'h2');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.wait(2);
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.wait(2);
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.wait(2);
    I.see('Your email address is invalid');
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.click('Continue');
    I.wait(2);
    I.see('Your first name is invalid');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.click('Sign in to your account.');
    I.wait(2);
    I.seeInCurrentUrl('redirect_uri=' + encodeURIComponent(redirectUri).toLowerCase());
    I.seeInCurrentUrl('client_id=' + serviceName);
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @uplift I am able to use a pin to create an account as an uplift user', async (I) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + '/login/uplift?client_id=' + serviceName + '&redirect_uri=' + redirectUri + '&jwt=' + accessToken);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.fillField('#firstName', randomUserFirstName);
    I.fillField('#lastName', randomUserLastName);
    I.fillField('#username', citizenEmail);
    I.scrollPageToBottom();
    I.click('Continue');
    I.waitForText('Check your email', 20, 'h1');
    var url = await I.extractUrl(citizenEmail);
    if (url) {
    url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 60, 'h1');
    I.see('You can now sign in to your account.');
});

Scenario('@functional @upliftLogin I am able to use a pin to create an account as an uplift user', async (I) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + '/login/uplift?client_id=' + serviceName + '&redirect_uri=' + redirectUri + '&jwt=' + accessToken);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.click('Sign in to your account.');
    I.wait(2);
    I.seeInCurrentUrl('register?redirect_uri=' + encodeURIComponent(redirectUri).toLowerCase() + '&client_id=' + serviceName);
    I.fillField('#username', existingCitizenEmail);
    I.fillField('#password', password);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText("https://idam.testservice.gov.uk");
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});
