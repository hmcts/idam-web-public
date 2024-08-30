const chai = require('chai');
const {expect} = chai;
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
let isEnvtPerftest = TestData.WEB_PUBLIC_URL.includes("perftest");

if (isEnvtPerftest){
    xFeature('moj login tests');
} else {
    Feature('moj login tests');
}

let serviceNames = [];

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword=randomData.getRandomUserPassword();
let mojUserRole;
let randomUserFirstName;
let accessToken;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    const token = await I.getToken();

    mojUserRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_mojlogintest", 'role description', [], token);

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [mojUserRole.name], token, ["openid", "profile", "roles"],[TestData.MOJ_SSO_PROVIDER_KEY],false,TestData.SERVICE_REDIRECT_URI);

    serviceNames.push(serviceName);
    //test
    I.wait(0.5);

    accessToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(token, TestData.MOJ_TEST_USER_USERNAME, userPassword, randomUserFirstName, [mojUserRole.name]);
});




Scenario('@functional @moj As an Justice.gov.uk user, I can login into idam through OIDC', async ({ I }) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/o/authorize?login_hint=${TestData.MOJ_SSO_PROVIDER_KEY}&client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitInUrl('/login/oauth2/code/moj');
    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.MOJ_TEST_USER_USERNAME);
    I.clickWithWait('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.MOJ_TEST_USER_PASSWORD);
    I.clickWithWait('Sign in');
    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.clickWithWait('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.clickWithWait('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.dontSee('error=');

        const pageSource = await I.grabSource();
        const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
        const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

        const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
        expect(userInfo.active).to.equal(true);
        expect(userInfo.email).to.equal(TestData.MOJ_TEST_USER_USERNAME);
        expect(userInfo.id).to.not.equal(null);
        expect(userInfo.forename).to.not.equal(null);
        expect(userInfo.surname).to.not.equal(null);
        expect(userInfo.roles.length).to.be.greaterThan(0);
    }

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @moj As an Justice.gov.uk user, I should be able to login through the Justice.gov.uk login link from idam', async ({ I }) => {
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName.toUpperCase()}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in');
    I.waitForText('Log in with your Justice.gov.uk account');
    I.clickWithWait('Log in with your Justice.gov.uk account');
    I.waitInUrl('/oauth2/authorize');
    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.MOJ_TEST_USER_USERNAME);
    I.clickWithWait('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.MOJ_TEST_USER_PASSWORD);
    I.clickWithWait('Sign in');
    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.clickWithWait('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.clickWithWait('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.dontSee('error=');

        const pageSource = await I.grabSource();
        const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
        const accessToken = await I.getAccessToken(code, serviceName.toUpperCase(), TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

        const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
        expect(userInfo.active).to.equal(true);
        expect(userInfo.email).to.equal(TestData.MOJ_TEST_USER_USERNAME);
        expect(userInfo.id).to.not.equal(null);
        expect(userInfo.forename).to.not.equal(null);
        expect(userInfo.surname).to.not.equal(null);
        expect(userInfo.roles.length).to.be.greaterThan(0);

        I.resetRequestInterception();
    }

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @moj As a Justice.gov.uk user, I should be redirected to MoJ IDAM for login if I enter my username on the login screen', async ({ I }) => {
    await I.deleteUser(TestData.MOJ_TEST_USER_USERNAME);
    await I.createUserUsingTestingSupportService(accessToken, TestData.MOJ_TEST_USER_USERNAME, userPassword, randomUserFirstName, [mojUserRole.name], "moj", TestData.MOJ_TEST_USER_SSO_ID);
    //redirection verification
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in');
    I.fillField('#username', TestData.MOJ_TEST_USER_USERNAME);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');

    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.MOJ_TEST_USER_USERNAME);
    I.clickWithWait('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.MOJ_TEST_USER_PASSWORD);
    I.clickWithWait('Sign in');

    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.clickWithWait('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.clickWithWait('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
    }

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @moj As a Justice.gov.uk user, I should be able to SSO even if my SSO ID has changed', async ({ I }) => {
    await I.deleteUser(TestData.MOJ_TEST_USER_USERNAME);

    const oldSsoId = randomData.getRandomString()
    await I.createUserUsingTestingSupportService(accessToken, TestData.MOJ_TEST_USER_USERNAME, userPassword, randomUserFirstName, [mojUserRole.name], "moj", oldSsoId);

    //redirection verification
    I.amOnPage(TestData.WEB_PUBLIC_URL + `/login?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`);
    I.waitForText('Sign in');
    I.waitForText('Log in with your Justice.gov.uk account');
    I.clickWithWait('Log in with your Justice.gov.uk account');
    I.waitInUrl('/oauth2/authorize');
    I.waitForText('Sign in');
    I.fillField('loginfmt', TestData.MOJ_TEST_USER_USERNAME);
    I.clickWithWait('Next');
    I.waitForText('Enter password');
    I.fillField('passwd', TestData.MOJ_TEST_USER_PASSWORD);
    I.clickWithWait('Sign in');
    I.waitForText('Stay signed in?');

    if (TestData.WEB_PUBLIC_URL.includes("-pr-") || TestData.WEB_PUBLIC_URL.includes("staging")) {
        I.clickWithWait('No');
        // expected to be not redirected with the code for pr and staging urls as they're not registered with AAD.
        I.waitInUrl("/kmsi");
        I.see("Make sure the redirect URI sent in the request matches one added to your application in the Azure portal");
    } else {
        I.interceptRequestsAfterSignin();
        I.clickWithWait('No');
        I.waitForText(TestData.SERVICE_REDIRECT_URI);
        I.see('code=');
        I.dontSee('error=');

        const getUserByEmailResponse = await I.getUserByEmail(TestData.MOJ_TEST_USER_USERNAME);
        const newSsoId = getUserByEmailResponse.ssoId;
        expect(newSsoId).to.not.equal(oldSsoId);
        expect(newSsoId).to.equal(TestData.MOJ_TEST_USER_SSO_ID);
        expect(getUserByEmailResponse.ssoProvider).to.equal("moj");

        I.resetRequestInterception();
    }

}).retry(TestData.SCENARIO_RETRY_LIMIT);