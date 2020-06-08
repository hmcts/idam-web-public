const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const chai = require('chai');
const {expect} = chai;

Feature('I am able to uplift a user');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let citizenEmail;
let existingCitizenEmail;
let accessToken;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    randomUserLastName = randomData.getRandomUserName() + 'pinępinç';
    randomUserFirstName = randomData.getRandomUserName() + 'ępinçłpin';
    adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    existingCitizenEmail = 'existingcitizen.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_beta", 'beta description', '', token);
    const serviceBetaRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_admin", 'admin description', serviceBetaRole, token);
    const serviceAdminRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_super", 'super description', serviceAdminRole, token);
    const serviceSuperRole = response.name;
    const serviceRoles = [serviceBetaRole, serviceAdminRole, serviceSuperRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceBetaRole, token);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName + 'Admin');
    await I.createUserWithRoles(existingCitizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');

    const pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

After((I) => {
    I.resetRequestInterception();
});

Scenario('@functional @loginWithPin As a Defendant, I should be able to login with the pin received from the Claimant', async (I) => {
    let pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/pin?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`);
    I.waitForText('Enter security code', 30, 'h1');
    I.fillField('#pin', pinUser.pin);

    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    let userInfo = await I.retry({retries: 3, minTimeout: 10000}).getOidcUserInfo(accessToken);
    expect(userInfo.roles).to.eql(['letter-holder']);
});

Scenario('@functional @uplift @upliftvalid User Validation errors', (I) => {
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.click("Continue");
    I.waitForText('Information is missing or invalid', 20, 'h2');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.see('Your email address is invalid');
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.click('Continue');
    I.see('Your first name is invalid');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.click('Sign in to your account.');
    I.seeInCurrentUrl(`redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}`);
    I.seeInCurrentUrl('client_id=' + serviceName);
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @uplift I am able to use a pin to create an account as an uplift user', async (I) => {
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.fillField('#firstName', randomUserFirstName);
    I.fillField('#lastName', randomUserLastName);
    I.fillField('#username', citizenEmail);
    I.scrollPageToBottom();
    I.click('Continue');
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    let url = await I.extractUrl(citizenEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 60, 'h1');
    I.see('You can now sign in to your account.');
});

Scenario('@functional @uplift @upliftLogin uplift a user via login journey', async (I) => {
    const pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Sign in to your account.', 30);
    I.click('Sign in to your account.');
    I.seeInCurrentUrl(`register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}`);
    I.fillField('#username', existingCitizenEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
});