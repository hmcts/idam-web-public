var TestData = require('./config/test_data');

Feature('Users can sign in');

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
     I.deleteUser(adminEmail),
     I.deleteUser(citizenEmail),
     I.deleteService(serviceName)
    ]);
});

Scenario('@functional @login As a citizen user I can login with email in uppercase', (I) => {
  var loginUrl = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName;

  I.amOnPage(loginUrl);
  I.waitForText('Sign in', 20, 'h1');
  I.fillField('#username', citizenEmail.toUpperCase());
  I.fillField('#password', password);
  I.interceptRequestsAfterSignin();
  I.click('Sign in');
  I.waitForText(serviceRedirectUri);
  I.see('code=');
  I.dontSee('error=');
  I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);