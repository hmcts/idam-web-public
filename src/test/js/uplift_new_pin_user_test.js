const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;
const assert = require('assert');

Feature('I am able to uplift a user');

let testFirstName;
let testCitizenEmail;
let testServiceAccessToken;
let testAccessTokenClientSecret;
const testSuitePrefix = randomData.getRandomAlphabeticString();
const testServiceName = randomData.getRandomServiceName(testSuitePrefix);
const testServiceClientSecret = randomData.getRandomClientSecret();
const testUserPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    testFirstName = randomData.getRandomUserName(testSuitePrefix) ;
    testCitizenEmail = 'existingcitizen.' + randomData.getRandomEmailAddress();

    await I.createServiceData(testServiceName,testServiceClientSecret)
    I.wait(0.5);

    testAccessTokenClientSecret = await I.getAccessTokenClientSecret(testServiceName, testServiceClientSecret);
    await I.createUserUsingTestingSupportService(testAccessTokenClientSecret, testCitizenEmail, testUserPassword, testFirstName + 'Citizen', ["citizen"]);

    const pin = await I.getPinUser(testFirstName, testFirstName);
    const authCode = await I.loginAsPin(pin.pin, testServiceName, TestData.SERVICE_REDIRECT_URI);
    testServiceAccessToken = await I.getAccessToken(authCode, testServiceName, TestData.SERVICE_REDIRECT_URI, testServiceClientSecret);
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

After(({ I }) => {
    I.resetRequestInterception();
});

Scenario('@functional @uplift I am able to use a pin to create an account as an uplift user', async ({ I }) => {
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${testServiceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${testServiceAccessToken}`);
    I.waitForText('Create an account or sign in');
    I.fillField('#firstName', testFirstName);
    I.fillField('#lastName', testFirstName);
    I.fillField('#username', testCitizenEmail);
    await I.runAccessibilityTest();
    I.click('.form input[type=submit]');
    I.waitForText('Check your email');
    let url = await I.extractUrlFromNotifyEmail(testAccessTokenClientSecret, testCitizenEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    let userInfo = await I.retry({retries: 3, minTimeout: 10000}).getOidcUserInfo(testServiceAccessToken);
    expect(userInfo.roles).to.eql(['letter-holder']);
});
