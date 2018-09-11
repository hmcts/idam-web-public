var TestData = require('./config/test_data');

Feature('Users can sign in');

let adminEmail;
let randomUserLastName;
let citizenEmail;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const serviceRedirectUri = "https://www.autotest.com";

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

Scenario('@functional @login As a citizen user I can login', (I) => {
  var loginUrl = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName;

  I.amOnPage(loginUrl);
  I.waitInUrl('/login', 180);
  I.waitForText('Sign in', 20, 'h1');
  I.fillField('#username', citizenEmail);
  I.fillField('#password', password);
  I.click('Sign in');
  I.waitInUrl(serviceRedirectUri, 180);
  I.seeInCurrentUrl('code=');
  I.dontSeeInCurrentUrl('error=');

}).retry(0);
//}).retry(TestData.SCENARIO_RETRY_LIMIT);