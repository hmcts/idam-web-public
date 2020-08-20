const chai = require('chai');
const {expect} = chai;
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('eJudiciary login Test');

let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    const token = await I.getAuthToken();
    await I.createService(serviceName, '', token, 'openid profile roles', [TestData.EJUDICIARY_SSO_PROVIDER_KEY]);
    serviceNames.push(serviceName);
});

AfterSuite(async (I) => {
    I.deleteUser(TestData.EJUDICIARY_TEST_USER_USERNAME);
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@ejudiciary As an ejudiciary user, I can login into idam through OIDC', async (I) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/o/authorize?login_hint=${TestData.EJUDICIARY_SSO_PROVIDER_KEY}&client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitInUrl('/login/oauth2/code/oidc', 180);
    I.waitForText('Sign in', 20);
    I.fillField('loginfmt', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.click('Next');
    I.waitForText('Enter password', 20);
    I.fillField('passwd', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');
    I.waitForText('Stay signed in?', 20);
    I.interceptRequestsAfterSignin();
    I.click('No');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(TestData.EJUDICIARY_TEST_USER_USERNAME);
    expect(userInfo.forename).to.equal('SIDM EJUD');
    expect(userInfo.surname).to.equal('TEST A');
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.roles).to.eql(['judiciary']);

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@ejudiciary As an ejudiciary user, I should be able to login through the ejudiciary login link from idam', async (I) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in', 20, 'h2');
    I.waitForText('Login with your eJudiciary account', 20);
    I.fillField('#username', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.fillField('#password', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');
    I.waitForText('You need to log in with a different account', 20, 'h2');
    I.click('Login with your eJudiciary account');
    I.waitInUrl('/login/oauth2/code/oidc', 180);
    I.waitForText('Sign in', 20);
    I.fillField('loginfmt', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.click('Next');
    I.waitForText('Enter password', 20);
    I.fillField('passwd', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');
    I.waitForText('Stay signed in?', 20);
    I.interceptRequestsAfterSignin();
    I.click('No');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);