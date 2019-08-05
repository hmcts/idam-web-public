var TestData = require('./config/test_data');
var assert = require('assert');

const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const { expect } = chai;

Feature('Service can request a scope on user authentication');

const customScope = 'manage-roles';

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const citizenPassword = 'Passw0rdIDAM';
const serviceRedirectUri = 'https://idam.testservice.gov.uk';
const serviceClientSecret = 'autotestingservice';

const citizenRole = 'citizen';
const pinUserRolePrefix = 'letter-';
const dynamicRoleNameForCitizenUser = 'dynamic-citizen-role-' + Date.now();
const dynamicRoleNameForPinUser = 'dynamic-respondent-role-' + Date.now();

const loginUrl = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=' + serviceRedirectUri + '&client_id=' + serviceName + '&scope=' + customScope;

let citizenFirstName, citizenLastName, citizenEmail, respondentEmail;

BeforeSuite(async (I) => {
    let randomText = await I.generateRandomText();
    citizenFirstName = citizenLastName = randomText;
    citizenEmail = 'citizen.' + randomText + testMailSuffix;
    respondentEmail = 'respondent.' + randomText + testMailSuffix;

    let token = await I.getAuthToken();
    await I.createRole(dynamicRoleNameForCitizenUser, '', '', token)
    await I.createRole(dynamicRoleNameForPinUser, '', '', token)
    await I.createServiceWithRoles(serviceName, [ dynamicRoleNameForCitizenUser, dynamicRoleNameForPinUser ], '', token, customScope);
    await I.createUserWithRoles(citizenEmail, 'Citizen', []);
    await I.createUserWithRoles(respondentEmail, 'Respondent', []);
});

AfterSuite(async (I) => {
return Promise.all([
     I.deleteUser(citizenEmail),
     I.deleteUser(respondentEmail),
     I.deleteService(serviceName)
    ]);
});

Scenario('@functional As a service, I can request a custom scope on user login',  async (I) => {
  I.amOnPage(loginUrl);
  I.waitForText('Sign in', 20, 'h1');
  I.fillField('#username', citizenEmail);
  I.fillField('#password', citizenPassword);

  I.interceptRequestsAfterSignin();
  I.click('Sign in');
  I.waitForText(serviceRedirectUri);
  I.see('code=');

  let pageSource = await I.grabSource();
  let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
  let accessToken = await I.getAccessToken(code, serviceName, serviceRedirectUri, serviceClientSecret);

  await I.grantRoleToUser(dynamicRoleNameForCitizenUser, accessToken);

  let userInfo = await I.getUserInfo(accessToken);
  expect(userInfo.roles).to.deep.equal([ dynamicRoleNameForCitizenUser ]);

  I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional As a service, I can request a custom scope on PIN user login',  async (I) => {
    let pinUser = await I.getPinUser(citizenFirstName, citizenLastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;
    let code = await I.loginAsPin(pinUser.pin, serviceName, serviceRedirectUri);
    let accessToken = await I.getAccessToken(code, serviceName, serviceRedirectUri, serviceClientSecret);

    I.amOnPage(TestData.WEB_PUBLIC_URL + '/register?client_id=' + serviceName + '&redirect_uri=' + serviceRedirectUri + '&scope=' + customScope + '&jwt=' + accessToken);
    I.wait(5);
    I.waitForText('Sign in or create an account', 30, 'h1');
    I.fillField('#username', respondentEmail);
    I.fillField('#password', citizenPassword);

    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.wait(5);
    I.waitForText(serviceRedirectUri);
    I.see('code=');

    let pageSource = await I.grabSource();
    I.wait(5);
    code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    accessToken = await I.getAccessToken(code, serviceName, serviceRedirectUri, serviceClientSecret);
    I.wait(5);

    await I.grantRoleToUser(dynamicRoleNameForPinUser, accessToken);
    I.wait(5);

    let userInfo = await I.retry({retries:3, minTimeout:10000}).getUserInfo(accessToken);
    I.wait(5);
    expect(userInfo.roles).to.deep.equalInAnyOrder([ pinUserRole, citizenRole, dynamicRoleNameForPinUser ]);

    I.wait(5);
    I.resetRequestInterception();

})