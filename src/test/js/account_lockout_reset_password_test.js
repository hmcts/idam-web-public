var TestData = require('./config/test_data');

Feature('When I am locked out of my account, resetting my password unlocks it');

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

 Scenario('@functional @unlock My user account is unlocked when I reset my password - citizen', async (I) => {
       I.amOnPage(TestData.WEB_PUBLIC_URL + '/users/selfRegister?redirect_uri=https://www.autotest.com&client_id=' + serviceName);
       I.click('Sign in to your account');
       I.waitInUrl('/login', 180);
       I.waitForText('Sign in or create an account', 20, 'h1');
       I.lockAccount(citizenEmail);
       I.waitForText('There is a problem with your account login details');
       I.see('Your account is locked due to too many unsuccessful attempts.');
       I.click('reset your password');
       I.waitForText('Reset your password', 20, 'h1');
       I.fillField('#email', citizenEmail);
       I.click('Submit');
       I.waitForText('Check your email', 20, 'h1');
       await I.verifyEmailSent(citizenEmail);
 }).retry(TestData.SCENARIO_RETRY_LIMIT);