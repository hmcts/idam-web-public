const chai = require('chai');
const {expect} = chai;
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Users can sign in');

let randomUserFirstName;
let citizenEmail;
let idamServiceAccountUserEmail;
let userFirstNames = [];
let serviceNames = [];

const testSuitePrefix = "luftest" + randomData.getRandomAlphabeticString();
const serviceName =  randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();
const largeCookieValue = randomData.getRandomTextFor11KB();

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    idamServiceAccountUserEmail = 'idamserviceaccount.' + randomData.getRandomEmailAddress();
    const testingToken =  await I.getToken();
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,'', testingToken, [], []);
    serviceNames.push(serviceName);

    I.wait(0.5);

    await I.createUserUsingTestingSupportService(testingToken, citizenEmail, userPassword, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');

    await I.createUserUsingTestingSupportService(testingToken, idamServiceAccountUserEmail, userPassword, randomUserFirstName + 'idamserviceaccount', ["idam-service-account"]);
    userFirstNames.push(randomUserFirstName + 'idamserviceaccount');
});

Scenario('@functional @login As a citizen user I can login with spaces in uppercase email', async ({ I }) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;
    I.amOnPage(loginUrl);

    // Set around 11 kb of cookie.
    await I.addCookie('idam.request', largeCookieValue);
    I.waitForText('Cookies on hmcts-access.service.gov.uk');
    await I.runAccessibilityTest();
    I.click('Accept additional cookies');
    I.click('#cookie-accept-all-success-banner-hide');
    I.waitForText('Sign in');
    I.fillField('#username', ' ' + citizenEmail.toUpperCase() + '  ');
    I.fillField('#password', userPassword);
    await I.runAccessibilityTest();
    I.startRedirectRequestTracking();
    I.clickWithWait('Sign in');
    const {code} = await I.waitForRedirectWithCodeTo(TestData.SERVICE_REDIRECT_URI);
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(citizenEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName + 'Citizen');
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.eql(['citizen']);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(citizenEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.eql(['citizen']);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'Citizen' + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'Citizen');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.stopRedirectRequestTracking();
    I.clearCookie();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @loginWithPrompt As a citizen user I can login with prompt = login', async ({ I }) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&prompt=login`;
    I.amOnPage(loginUrl);
    I.waitForText('Cookies on hmcts-access.service.gov.uk');
    I.click('Reject additional cookies');
    I.click('Hide this cookie message');
    await I.runAccessibilityTest();
    I.waitForText('Sign in');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', userPassword);
    await I.runAccessibilityTest();
    I.startRedirectRequestTracking();
    I.clickWithWait('Sign in');
    const {code} = await I.waitForRedirectWithCodeTo(TestData.SERVICE_REDIRECT_URI);
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(citizenEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName + 'Citizen');
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.eql(['citizen']);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub).to.equal(citizenEmail);
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.eql(['citizen']);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'Citizen' + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'Citizen');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.stopRedirectRequestTracking();
    I.clearCookie();
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @login As a user, I should see the error message displayed for invalid email', async ({ I }) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;
    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', '');
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('There is a problem');
    I.waitForText('Email address cannot be blank');
    I.waitForText('Email address is not valid');
    await I.runAccessibilityTest();
    I.fillField('#username', 'invalidemail@');
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('There is a problem');
    I.waitForText('Email address is not valid');
    I.fillField('#username', 'invalidemail.com');
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('There is a problem');
    I.waitForText('Email address is not valid');
    I.fillField('#username', 'invalid@email@hhh.com');
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('There is a problem');
    I.waitForText('Email address is not valid');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @login @idamserviceaccount As a idam service account role user, I should see the error message displayed for login', async ({ I }) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;
    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', idamServiceAccountUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('Incorrect email or password');
}).retry(TestData.SCENARIO_RETRY_LIMIT);
