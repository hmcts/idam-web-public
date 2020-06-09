const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const assert = require('assert');
const Welsh = require('./shared/welsh_constants');

Feature('Welsh Language');

const serviceName = randomData.getRandomServiceName();
const citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

let userFirstNames = [];
let serviceNames = [];
let randomUserFirstName;
let randomUserLastName;
let specialCharacterPassword;


BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    randomUserLastName = randomData.getRandomUserName();
    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(citizenEmail, randomUserFirstName, ["citizen"]);
    userFirstNames.push(randomUserFirstName);
    specialCharacterPassword = 'New%%%&&&234';
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @welshLanguage There is a language switch that is working', async (I) => {

    const welshLinkValue = 'Cymraeg';
    const englishLinkValue = 'English';

    I.amOnPage(Welsh.pageUrlWithParamEnglish);

    I.waitForText('Access Denied', 20, 'h1');
    I.waitForText(welshLinkValue);

    I.click(welshLinkValue);
    I.waitForText(Welsh.accessDeniedWelsh, 20, 'h1');
    I.waitForText(englishLinkValue);

    I.click(englishLinkValue);
    I.waitForText(welshLinkValue, 20);
});

Scenario('@functional @welshLanguage I can set the language with a cookie', async (I) => {

    I.amOnPage(Welsh.pageUrl);
    I.setCookie({name: Welsh.localeCookie, value: 'cy'});
    I.amOnPage(Welsh.pageUrl);
    I.waitForText(Welsh.accessDeniedWelsh, 20, 'h1');
});

Scenario('@functional @welshLanguage I can set the language with a header', async (I) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.haveRequestHeaders({'Accept-Language': 'cy'});
    I.amOnPage(Welsh.pageUrl);
    I.waitForText(Welsh.accessDeniedWelsh, 20, 'h1');
});

Scenario('@functional @welshLanguage I can set the language with a parameter', async (I) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(Welsh.pageUrlWithParamWelsh);
    I.waitForText(Welsh.accessDeniedWelsh, 20, 'h1');
});

Scenario('@functional @welshLanguage I can set the language to English with an invalid parameter', async (I) => {

    I.amOnPage(Welsh.pageUrl);
    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(Welsh.pageUrl + '?' + Welsh.urlInvalidLang);
    I.waitForText('Access Denied', 20, 'h1');
});

Scenario('@functional @welshLanguage I can reset my password in Welsh', async (I) => {

    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginPage);
    I.waitForText(Welsh.signInOrCreateAccount, 20, 'h1');
    I.see(Welsh.forgottenPassword);
    I.click(Welsh.forgottenPassword);
    I.waitInUrl('reset/forgotpassword');
    I.waitForText(Welsh.resetYourPassword, 20, 'h1');
    I.fillField('#email', citizenEmail);
    I.click(Welsh.submitBtn);
    I.waitForText(Welsh.checkYourEmail, 20, 'h1');
    I.wait(5);
    const userPwdResetUrl = await I.extractUrl(citizenEmail);
    I.amOnPage(userPwdResetUrl);
    I.waitForText(Welsh.createANewPassword, 20, 'h1');
    I.fillField('#password1', specialCharacterPassword);
    I.fillField('#password2', specialCharacterPassword);
    I.click(Welsh.continueBtn);
    I.waitInUrl('doResetPassword');
    I.waitForText(Welsh.passwordChanged, 20, 'h1');
});
