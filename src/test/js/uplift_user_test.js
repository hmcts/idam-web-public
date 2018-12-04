var TestData = require('./config/test_data');

Feature('I am able to uplift a user');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let citizenEmail;
let accessToken;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    citizenEmail = 'citizen.' + randomUserLastName + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(serviceName + "_beta", 'beta description', '', token);
    await I.createRole(serviceName + "_admin", 'admin description', serviceName + "_beta", token);
    await I.createRole(serviceName + "_super", 'super description', serviceName + "_admin", token);
    var serviceRoles = [serviceName + "_beta", serviceName + "_admin", serviceName + "_super"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_admin", "IDAM_ADMIN_USER"]);

    var pin = await I.getPin(randomUserFirstName, randomUserLastName);
    var code = await I.loginAsPin(pin, serviceName, redirectUri);
    accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);
});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteService(serviceName),
     I.deleteUser(adminEmail),
     I.deleteUser(citizenEmail)
    ]);
});

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
 // NOTE: Retrying this scenario is problematic.