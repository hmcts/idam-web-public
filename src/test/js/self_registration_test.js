const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const assert = require('assert');
const Welsh = require('./shared/welsh_constants');
const chai = require('chai');
const {expect} = chai;

Feature('Self Registration');

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

const formSubmitButton = '.form input[type=submit]';

let randomUserFirstName;
let randomUserLastName;
let accessToken;

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    const testingToken =  await I.getToken();

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,'', testingToken, [], []);
    serviceNames.push(serviceName);

    I.wait(0.5);

    accessToken = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);

});

Scenario('@functional @selfregister User Validation errors', async ({ I }) => {

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.click(formSubmitButton);
    await I.runAccessibilityTest();
    I.waitForText('There is a problem');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    await I.runAccessibilityTest();
    I.fillField('firstName', 'Lucy');
    I.click(formSubmitButton);
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click(formSubmitButton);
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click(formSubmitButton);
    I.see('Your email address is invalid');
    await I.runAccessibilityTest();
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.click(formSubmitButton);
    I.see('Your first name is invalid');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.waitForText('Sign in');
    I.see('Sign in');
    await I.runAccessibilityTest();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @welshLanguage Account already created (no language)', async ({ I }) => {

    const citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, citizenEmail, userPassword, randomUserFirstName, ["citizen"]);

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    await I.runAccessibilityTest();
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmail);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    await I.runAccessibilityTest();
    const emailResponse = await I.getEmailFromNotifyUsingTestingSupportService(accessToken, citizenEmail);
    assert.equal('You already have an account', emailResponse.subject);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @welshLanguage Account already created (force Welsh)', async ({ I }) => {

    const citizenEmailWelsh = 'citizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, citizenEmailWelsh, userPassword, randomUserFirstName + 'Welsh', ["citizen"]);

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl + Welsh.urlForceCy);
    I.waitInUrl('users/selfRegister');
    I.waitForText(Welsh.createAnAccountOrSignIn);

    let cookie = await I.grabCookie(Welsh.localeCookie);
    assert(cookie.value, 'cy');

    I.see(Welsh.createAnAccount);
    await I.runAccessibilityTest();
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmailWelsh);
    I.click(formSubmitButton);
    I.waitForText(Welsh.checkYourEmail);
    await I.runAccessibilityTest();
    const emailResponse = await I.getEmailFromNotifyUsingTestingSupportService(accessToken, citizenEmailWelsh);
    assert.equal(Welsh.youAlreadyHaveAccountSubject, emailResponse.subject);
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @welshLanguage I can self register (no language)', async ({ I }) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click(formSubmitButton);
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    await I.runAccessibilityTest();
    I.amOnPage(loginPage);
    await I.runAccessibilityTest();
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account');
    I.fillField('#username', email);
    I.fillField('#password', userPassword);
    await I.runAccessibilityTest();
    I.interceptRequestsAfterSignin();
    I.click(formSubmitButton);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister @welshLanguage I can self register (Welsh)', async ({ I }) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.amOnPage(selfRegUrl + Welsh.urlForceCy);
    I.waitInUrl('users/selfRegister');
    I.waitForText(Welsh.createAnAccountOrSignIn);

    I.see(Welsh.createAnAccount);
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText(Welsh.checkYourEmail);
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);
    I.amOnPage(userActivationUrl);
    I.waitForText(Welsh.createAPassword);
    I.seeTitleEquals(Welsh.userActivationTitle);
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click(formSubmitButton);
    I.waitForText(Welsh.accountCreated);
    I.see(Welsh.youCanNowSignIn);
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText(Welsh.signInOrCreateAccount);
    I.fillField('#username', email);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click(formSubmitButton);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister I can self register and cannot use activation link again', async ({ I }) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click(formSubmitButton);
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    I.wait(3);
    I.amOnPage(userActivationUrl);
    I.waitForText('Your account is already activated.');
});


Scenario('@functional @selfregister @prePopulatedScreen I can self register with pre-populated user account screen', async ({ I }) => {
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;
    const randomUserEmailAddress = 'citizen.' + randomData.getRandomEmailAddress();
    const userAccountDetails = {
        firstName: randomUserFirstName,
        lastName: randomUserLastName,
        email: randomUserEmailAddress
    };
    const base64EncodedJsonObject = await I.getBase64FromJsonObject(JSON.stringify(userAccountDetails));

    I.amOnPage(`${selfRegUrl}&form_data=${base64EncodedJsonObject}`);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');

    I.see('Create an account');

    I.seeInField('firstName', randomUserFirstName);
    I.seeInField('lastName', randomUserLastName);
    I.seeInField('email', randomUserEmailAddress);

    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, randomUserEmailAddress);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click(formSubmitButton);
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account');
    I.fillField('#username', randomUserEmailAddress);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click(formSubmitButton);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister I can self register with repeated special characters in password', async ({ I }) => {

    const specialCharacterPassword = 'New%%%&&&234';
    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('#password1', specialCharacterPassword);
    I.fillField('#password2', specialCharacterPassword);
    I.click(formSubmitButton);
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account');
    I.fillField('#username', email);
    I.fillField('#password', specialCharacterPassword);
    I.interceptRequestsAfterSignin();
    I.click(formSubmitButton);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister @passwordvalidation Validation displayed when I try to create my password with a blacklisted/invalid password', async ({ I }) => {

    const email = 'test_citizen2.' + randomData.getRandomEmailAddress();

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password');
    I.seeTitleEquals('User Activation - HMCTS Access - GOV.UK');
    I.fillField('password1', 'Passw0rd');
    I.fillField('password2', 'Passw0rd');
    I.click(formSubmitButton);
    I.waitForText('There is a problem');
    I.see("Your password is too easy to guess");
    I.fillField('password1', `${randomUserFirstName}Other6mKjmC`);
    I.fillField('password2', `${randomUserFirstName}Other6mKjmC`);
    I.click(formSubmitButton);
    I.waitForText('There is a problem');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', `${email}3ksTys`);
    I.fillField('password2', `${email}3ksTys`);
    I.click(formSubmitButton);
    I.waitForText('There is a problem');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', 'passwordidamtest');
    I.fillField('password2', 'passwordidamtest');
    I.click(formSubmitButton);
    I.waitForText('There is a problem');
    I.see('Your password didn\'t have all the required characters');
    I.fillField('password1', 'Lincoln1');
    I.fillField('password2', 'Lincoln1');
    I.click(formSubmitButton);
    I.waitForText('There is a problem');
    I.see("Your password is too easy to guess");
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @staleuserregister stale user should get you already have an account email', async ({ I }) => {

    let staleUserEmail = 'stale.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, staleUserEmail, userPassword, randomUserFirstName + 'Stale', ["citizen"]);
    await I.retireStaleUser(staleUserEmail)

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', staleUserEmail);
    I.click(formSubmitButton);

    I.waitForText('Check your email');

    const emailResponse = await I.getEmailFromNotifyUsingTestingSupportService(accessToken, staleUserEmail);
    assert.equal('You already have an account', emailResponse.subject);

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister I can create a password only once using the activation link opened in multiple tabs', async ({ I }) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const userActivationUrl = await I.extractUrlFromNotifyEmail(accessToken, email);

    // open activation link in 1st tab
    const page1 = await I.createNewPage();
    await page1.goto(userActivationUrl);

    // open same activation link in 2nd tab and activate the account
    const page2 = await I.createNewPage();
    await page2.goto(userActivationUrl);
    await page2.type('#password1', userPassword);
    await page2.type('#password2', userPassword);
    await page2.click('#activate');
    await page2.waitForSelector('h1.heading-large');
    const accountCreatedMessage = "Account created";
    const page2Message = await page2.$eval('h1.heading-large', el => el.textContent.trim());
    expect(page2Message).to.equal(accountCreatedMessage);
    await page2.close();

    // Try to activate the account again using the link already opened in 1st tab
    await page1.type('#password1', userPassword);
    await page1.type('#password2', userPassword);
    await page1.click('#activate');
    await page1.waitForSelector('h1.heading-large');
    const accountAlreadyActivatedMessage = 'Your account is already activated.';
    const page1Message = await page1.$eval('h1.heading-large', el => el.textContent.trim());
    expect(page1Message).to.equal(accountAlreadyActivatedMessage);
});

Scenario('@functional @selfregister @idamserviceaccount Account already created for idam service accont user', async ({ I }) => {

    let idamServiceAccountUserEmail = 'idamserviceaccount.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessToken, idamServiceAccountUserEmail, userPassword, randomUserFirstName + 'idamserviceaccount', ["idam-service-account"]);

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister');
    I.waitForText('Create an account or sign in');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', idamServiceAccountUserEmail);
    I.click(formSubmitButton);
    I.waitForText('Check your email');
    const emailResponse = await I.getEmailFromNotifyUsingTestingSupportService(accessToken, idamServiceAccountUserEmail);
    assert.equal('You already have an account', emailResponse.subject);
}).retry(TestData.SCENARIO_RETRY_LIMIT);