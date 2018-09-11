var TestData = require('./config/test_data');

Feature('I am able to uplift a user');

let adminEmail;
let randomUserLastName;
let citizenEmail;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    citizenEmail = 'citizen.' + randomUserLastName + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(serviceName + "_beta", 'beta description', '', token);
    await I.createRole(serviceName + "_admin", 'admin description', serviceName + "_beta", token);
    await I.createRole(serviceName + "_super", 'super description', serviceName + "_admin", token);
    var serviceRoles = [serviceName + "_beta", serviceName + "_admin", serviceName + "_super"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_admin", "IDAM_ADMIN_USER"]);
    await I.createUserWithRoles(citizenEmail, 'Citizen', ["citizen"]);
});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteService(serviceName),
     I.deleteUser(adminEmail),
     I.deleteUser(citizenEmail)
    ]);
});

 Scenario('@functional @uplift My user account is unlocked when I reset my password - citizen', async (I) => {
     var pin = await I.getPin('Test', 'User');

     var code = await I.loginAsPin(pin, serviceName, 'https://idam.testservice.gov.uk');

     var accessToken = await I.getAccessToken(code, serviceName, 'https://idam.testservice.gov.uk', 'autotestingservice');

     I.amOnPage(TestData.WEB_PUBLIC_URL + '/login/uplift?client_id=' + serviceName + '&redirect_uri=https://idam.testservice.gov.uk&jwt=' + accessToken);
     I.fillField('#firstName', 'Test');
     I.fillField('#lastName', 'User');
     I.fillField('#username', citizenEmail);
     I.click('Continue');
     I.waitForText('Check your email', 20, 'h1');
     await I.verifyEmailSent(citizenEmail);
 }).retry(0);