const chai = require('chai');
const {expect} = chai;
const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Users can sign in');

let randomUserFirstName;
let citizenEmail;
let userFirstNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);

    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @login As a citizen user I can login with spaces in uppercase email', async ({ I }) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', ' ' + citizenEmail.toUpperCase() + '  ');
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

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

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);
