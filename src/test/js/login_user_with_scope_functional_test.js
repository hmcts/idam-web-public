var TestData = require('./config/test_data');
var assert = require('assert');

Feature('Service can request a scope on user authentication');

const customScope = 'manage-roles';

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = 'Passw0rdIDAM';
const serviceRedirectUri = 'https://idam.testservice.gov.uk';
const serviceClientSecret = 'autotestingservice';

const loginUrl = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName + '&scope=' + customScope;

let citizenEmail;
let dynamicRoleName = 'dynamic-role-' + Date.now();

BeforeSuite(async (I) => {
    var randomLastName = await I.generateRandomText();
    citizenEmail = 'citizen.' + randomLastName + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(dynamicRoleName, '', '', token)
    await I.createService(serviceName, dynamicRoleName, token, customScope);
    await I.createUserWithRoles(citizenEmail, 'Citizen', []);
});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteService(serviceName),
     I.deleteUser(citizenEmail)
    ]);
});

Scenario('@functional As a service, I can request a custom scope on user login',  async (I) => {
  I.amOnPage(loginUrl);
  I.waitForText('Sign in', 20, 'h1');
  I.fillField('#username', citizenEmail);
  I.fillField('#password', password);

  I.interceptRequestsAfterSignin();
  I.click('Sign in');
  I.waitForText(serviceRedirectUri);
  I.see('code=');

  let pageSource = await I.grabSource();
  let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
  let accessToken = await I.getAccessToken(code, serviceName, serviceRedirectUri, serviceClientSecret);

  await I.grantRoleToUser(dynamicRoleName, accessToken);

  let userInfo = await I.getUserInfo(accessToken);
  assert.deepStrictEqual(userInfo.roles, [ dynamicRoleName ]);

  I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);