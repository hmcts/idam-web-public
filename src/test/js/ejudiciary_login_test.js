const chai = require('chai');
const {expect} = chai;
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
let isEnvtPerftest = TestData.WEB_PUBLIC_URL.includes("perftest");

if (isEnvtPerftest){
    xFeature('eJudiciary login tests');
} else {
    Feature('eJudiciary login tests');
}

let serviceNames = [];

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();

BeforeSuite(async ({ I }) => {
    const token = await I.getAuthToken();
    await I.createService(serviceName, serviceClientSecret, '', token, 'openid profile roles', [TestData.EJUDICIARY_SSO_PROVIDER_KEY]);
    serviceNames.push(serviceName);

    I.wait(0.5);
});

AfterSuite(async ({ I }) => {
    I.deleteUser(TestData.EJUDICIARY_TEST_USER_USERNAME);
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional @ejudiciary As an ejudiciary user, I can login into idam through OIDC', async ({ I }) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/o/authorize?login_hint=${TestData.EJUDICIARY_SSO_PROVIDER_KEY}&client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitInUrl('/login/oauth2/code/oidc');
    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.click('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');
    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.click('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.click('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.dontSee('error=');

        const pageSource = await I.grabSource();
        const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
        const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

        const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
        expect(userInfo.active).to.equal(true);
        expect(userInfo.email).to.equal(TestData.EJUDICIARY_TEST_USER_USERNAME);
        expect(userInfo.forename).to.equal('SIDM EJUD');
        expect(userInfo.surname).to.equal('TEST A');
        expect(userInfo.id).to.not.equal(null);
        expect(userInfo.roles).to.eql(['judiciary']);
    }

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @ejudiciary As an ejudiciary user, I should be able to login through the ejudiciary login link from idam', async ({ I }) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName.toUpperCase()}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in');
    I.waitForText('Log in with your eJudiciary account');
    I.click('Log in with your eJudiciary account');
    I.waitInUrl('/oauth2/authorize');
    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.click('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');

    I.waitForText('Stay signed in?');
    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.click('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.click('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.dontSee('error=');

        const pageSource = await I.grabSource();
        const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
        const accessToken = await I.getAccessToken(code, serviceName.toUpperCase(), TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

        const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
        expect(userInfo.active).to.equal(true);
        expect(userInfo.email).to.equal(TestData.EJUDICIARY_TEST_USER_USERNAME);
        expect(userInfo.forename).to.equal('SIDM EJUD');
        expect(userInfo.surname).to.equal('TEST A');
        expect(userInfo.id).to.not.equal(null);
        expect(userInfo.roles).to.eql(['judiciary']);

        I.resetRequestInterception();
    }

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @ejudiciary As an ejudiciary user, I should be redirected to eJudiciary for login if I enter my username on the login screen', async ({ I }) => {
    await I.deleteUser(TestData.EJUDICIARY_TEST_USER_USERNAME);

    const accessToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(accessToken, TestData.EJUDICIARY_TEST_USER_USERNAME, TestData.EJUDICIARY_TEST_USER_PASSWORD, "Judge", [ ], "azure", randomData.getRandomString());

    //redirection verification
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in');
    I.fillField('#username', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.fillField('#password', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');

    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.EJUDICIARY_TEST_USER_USERNAME);
    I.click('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.EJUDICIARY_TEST_USER_PASSWORD);
    I.click('Sign in');

    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.click('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.click('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.resetRequestInterception();
    }

}).retry(TestData.SCENARIO_RETRY_LIMIT);