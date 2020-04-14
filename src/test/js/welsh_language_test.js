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
