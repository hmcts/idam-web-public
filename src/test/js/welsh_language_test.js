const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const assert = require('assert');
const Welsh = require('./shared/welsh_constants');

Feature('Welsh Language');

const testSuitePrefix = "wltest" + randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();
const citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

let testingToken;
let userFirstNames = [];
let serviceNames = [];
let randomUserFirstName;
let randomUserLastName;
let specialCharacterPassword;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    testingToken = await I.getToken();
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,'', testingToken, [], []);
    serviceNames.push(serviceName);

    I.wait(0.5);

    await I.createUserUsingTestingSupportService(testingToken, citizenEmail, userPassword, randomUserFirstName, ["citizen"]);
    userFirstNames.push(randomUserFirstName);
    specialCharacterPassword = 'New%%%&&&234';
});

Scenario('@functional @welshLanguage There is a language switch that is working', async ({ I }) => {

    const welshLinkValue = 'Cymraeg';
    const englishLinkValue = 'English';

    I.amOnPage(Welsh.pageUrlWithParamEnglish);

    I.waitForText('Access Denied');
    await I.runAccessibilityTest();
    I.waitForText(welshLinkValue);

    I.clickWithWait(welshLinkValue);
    I.waitForText(Welsh.accessDeniedWelsh);
    await I.runAccessibilityTest();
    I.waitForText(englishLinkValue);

    I.clickWithWait(englishLinkValue);
    I.waitForText(welshLinkValue);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @welshLanguage I can set the language with a cookie', async ({ I }) => {

    I.amOnPage(Welsh.pageUrl);
    I.setCookie({name: Welsh.localeCookie, value: 'cy'});
    I.amOnPage(Welsh.pageUrl);
    I.waitForText(Welsh.accessDeniedWelsh);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

//TODO: add functional tag once the issue is fixed permanently (See  https://tools.hmcts.net/jira/browse/SIDM-4331)
// Note that this must be tested against AAT (or any other environment that uses Front Door) before it is enabled.
Scenario('@welshLanguage I can set the language with a header', async ({ I }) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.haveRequestHeaders({'Accept-Language': 'cy'});
    I.amOnPage(Welsh.pageUrl);
    I.waitForText(Welsh.accessDeniedWelsh);
});

Scenario('@functional @welshLanguage I can set the language with a parameter', async ({ I }) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(Welsh.pageUrlWithParamWelsh);
    I.waitForText(Welsh.accessDeniedWelsh);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @welshLanguage I can set the language to English with an invalid parameter', async ({ I }) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(Welsh.pageUrl + '?' + Welsh.urlInvalidLang);
    I.waitForText('Access Denied');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @welshLanguage I can reset my password in Welsh', async ({ I }) => {

    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginPage);
    I.waitForText(Welsh.signInOrCreateAccount);
    await I.runAccessibilityTest();
    I.see(Welsh.forgottenPassword);
    I.clickWithWait(Welsh.forgottenPassword);
    I.waitInUrl('reset/forgotpassword');
    I.waitForText(Welsh.resetYourPassword);
    I.fillField('#email', citizenEmail);
    await I.runAccessibilityTest();
    I.clickWithWait(Welsh.submitBtn);
    I.waitForText(Welsh.checkYourEmail);
    const userPwdResetUrl = await I.extractUrlFromNotifyEmail(testingToken, citizenEmail);
    I.amOnPage(userPwdResetUrl);
    I.waitForText(Welsh.createANewPassword);
    I.fillField('#password1', specialCharacterPassword);
    I.fillField('#password2', specialCharacterPassword);
    await I.runAccessibilityTest();
    I.clickWithWait(Welsh.continueBtn);
    I.waitInUrl('doResetPassword');
    I.waitForText(Welsh.passwordChanged);
    await I.runAccessibilityTest();
});
