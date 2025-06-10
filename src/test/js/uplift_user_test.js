const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;
const assert = require('assert');

Feature('I am able to uplift a user');

const pinUserRolePrefix = 'letter-';
let serviceBetaRole;
let accessTokenClientSecret;

const testSuitePrefix = "uutest" + randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {

    const token = await I.getToken();
    serviceBetaRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_beta", 'beta description', [], token);
    let serviceAdminRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_admin", 'admin description',[serviceBetaRole.name], token);
    let serviceSuperRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_super", 'super description', [serviceAdminRole.name], token);

    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [serviceBetaRole.name], token,["openid", "profile", "roles"],[],false,TestData.SERVICE_REDIRECT_URI) ;

    I.wait(0.5);

    accessTokenClientSecret = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);

});


After(({ I }) => {
    I.resetRequestInterception();
});

Scenario('@functional @loginWithPin As a Defendant, I should be able to login with the pin received from the Claimant', async ({ I }) => {

    let pinUser = await I.getPinUser(randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin', randomData.getRandomUserName(testSuitePrefix) + 'pinępinç');
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/pin?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`);
    I.waitForText('Enter security code');
    I.fillField('#pin', pinUser.pin);
    await I.runAccessibilityTest();
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Continue');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let userInfo = await I.retry({retries: 3, minTimeout: 10000}).getOidcUserInfo(accessToken);

    const letterRole = userInfo.roles.find(role => /^letter/.test(role));

    expect(userInfo.roles).to.eql(['letter-holder']);
    I.cleanupLetterHolderRoles(accessTokenClientSecret,userInfo.roles)
});

Scenario('@functional @uplift @upliftvalid    User Validation errors', async ({ I }) => {
    let lastName = randomData.getRandomUserName(testSuitePrefix) + 'pinępinç';
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, lastName);
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in');
    I.clickWithWait("Continue");
    I.waitForText('There is a problem');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('firstName', 'Lucy');
    I.clickWithWait('Continue');
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.clickWithWait('Continue');
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.clickWithWait('Continue');
    I.see('Your email address is invalid');
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.clickWithWait('Continue');
    I.see('Your first name is invalid');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.clickWithWait('Sign in to your account.');
    I.seeInCurrentUrl(`redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}`);
    I.seeInCurrentUrl('client_id=' + serviceName);
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @uplift  I am able to use a pin to create an account as an uplift user', async ({ I }) => {

    let lastName = randomData.getRandomUserName(testSuitePrefix) + 'pinępinç';
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, lastName);
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in');
    I.fillField('#firstName', randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin');
    I.fillField('#lastName', randomData.getRandomUserName(testSuitePrefix) + 'pinępinç');
    I.fillField('#username', citizenEmail);
    await I.runAccessibilityTest();
    I.clickWithWait('.form input[type=submit]');
    I.wait('1');
    I.waitForText('Check your email');
    let url = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, citizenEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    I.waitForText('Create a password');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.clickWithWait('Continue');
    I.wait('1');
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    await I.runAccessibilityTest();
});

Scenario('@functional @uplift  User should receive You already have an account email for Uplift via register using an existing email and in different case', async ({ I }) => {
    let lastName = randomData.getRandomUserName(testSuitePrefix) + 'pinępinç';
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, lastName);
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let existingCitizenEmail = 'existingcitizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, existingCitizenEmail, userPassword, firstName + 'Citizen', ["citizen"]);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in');
    I.fillField('#firstName', firstName);
    I.fillField('#lastName', lastName);
    console.log("email: " + existingCitizenEmail);
    I.fillField('#username', existingCitizenEmail.toUpperCase());
    I.clickWithWait('.form input[type=submit]');
    I.waitForText('Check your email');
    const emailResponse = await I.getEmailFromNotifyUsingTestingSupportService(accessTokenClientSecret, existingCitizenEmail.toUpperCase());
    expect(emailResponse.subject).to.equal('You already have an account');
});

Scenario('@functional @uplift @upliftLogin  uplift a user via login journey', async ({ I }) => {
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, randomData.getRandomUserName(testSuitePrefix) + 'pinępinç');
    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let existingCitizenEmail = 'existingcitizen.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, existingCitizenEmail, userPassword, firstName + 'Citizen', ["citizen"]);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Sign in to your account.');
    I.clickWithWait('Sign in to your account.');
    I.seeInCurrentUrl(`register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}`);
    I.fillField('#username', existingCitizenEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @uplift @staleUserUpliftAccountCreation  Send stale user registration for stale user uplift account creation', async ({ I }) => {
    const newPassword = randomData.getRandomUserPassword();
    let lastName = randomData.getRandomUserName(testSuitePrefix) + 'pinępinç';
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, lastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;

    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let upliftAccountCreationStaleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, upliftAccountCreationStaleUserEmail, userPassword, firstName + 'StaleUser', ["citizen"]);
    await I.retireStaleUser(upliftAccountCreationStaleUserEmail);

    const response = await I.getUserByEmail(upliftAccountCreationStaleUserEmail);
    const userId = response.id;

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in');
    I.fillField('#firstName', firstName);
    I.fillField('#lastName', lastName);
    I.fillField('#username', upliftAccountCreationStaleUserEmail.toUpperCase());
    I.scrollPageToBottom();
    I.clickWithWait('Continue');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.');
    await I.runAccessibilityTest();
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, upliftAccountCreationStaleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password');
    I.fillField('#password1', newPassword);
    I.fillField('#password2', newPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');
    await I.runAccessibilityTest();

    const responseAfterAccountReActivation = await I.getUserByEmail(upliftAccountCreationStaleUserEmail);
    expect(responseAfterAccountReActivation.id).to.equal(userId);
    expect(responseAfterAccountReActivation.forename).to.equal(firstName + 'StaleUser');
    expect(responseAfterAccountReActivation.surname).to.equal('User');
    expect(responseAfterAccountReActivation.email).to.equal(upliftAccountCreationStaleUserEmail);
    expect(responseAfterAccountReActivation.active).to.equal(true);
    expect(responseAfterAccountReActivation.stale).to.equal(false);
    expect(responseAfterAccountReActivation.roles).to.eql(['citizen']);
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', upliftAccountCreationStaleUserEmail);
    I.fillField('#password', newPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const loginCode = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const loginAccessToken = await I.getAccessToken(loginCode, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(loginAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(upliftAccountCreationStaleUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.equal(userId);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([pinUserRole, 'citizen', serviceBetaRole.name]);
    expect(oidcUserInfo.name).to.equal(firstName + 'StaleUser' + " User");
    expect(oidcUserInfo.given_name).to.equal(firstName + 'StaleUser');
    expect(oidcUserInfo.family_name).to.equal('User');
    I.resetRequestInterception();
    I.cleanupLetterHolderRoles(accessTokenClientSecret,oidcUserInfo.roles)
});

Scenario('@functional @uplift @staleUserUpliftLogin Send stale user registration for stale user uplift login', async ({ I }) => {
    const newPassword = randomData.getRandomUserPassword();
    let firstName = randomData.getRandomUserName(testSuitePrefix) + 'ępinçłpin';
    const pinUser = await I.getPinUser(firstName, randomData.getRandomUserName(testSuitePrefix) + 'pinępinç');
    let pinUserRole = pinUserRolePrefix + pinUser.userId;

    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    let upliftLoginStaleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, upliftLoginStaleUserEmail, userPassword, firstName + 'StaleUser', ["citizen"]);
    await I.retireStaleUser(upliftLoginStaleUserEmail);

    const response = await I.getUserByEmail(upliftLoginStaleUserEmail);
    const userId = response.id;

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', upliftLoginStaleUserEmail.toUpperCase());
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.');
    const reRegistrationUrl = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, upliftLoginStaleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password');
    I.fillField('#password1', newPassword);
    I.fillField('#password2', newPassword);
    I.clickWithWait('Continue');
    I.waitForText('Your password has been changed');
    I.see('You can now sign in with your new password.');

    const responseAfterAccountReActivation = await I.getUserByEmail(upliftLoginStaleUserEmail);
    expect(responseAfterAccountReActivation.id).to.equal(userId);
    expect(responseAfterAccountReActivation.forename).to.equal(firstName + 'StaleUser');
    expect(responseAfterAccountReActivation.surname).to.equal('User');
    expect(responseAfterAccountReActivation.email).to.equal(upliftLoginStaleUserEmail);
    expect(responseAfterAccountReActivation.active).to.equal(true);
    expect(responseAfterAccountReActivation.stale).to.equal(false);
    expect(responseAfterAccountReActivation.roles).to.eql(['citizen']);
    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account');
    I.fillField('#username', upliftLoginStaleUserEmail);
    I.fillField('#password', newPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const loginCode = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const loginAccessToken = await I.getAccessToken(loginCode, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(loginAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(upliftLoginStaleUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.equal(userId);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([pinUserRole, 'citizen', serviceBetaRole.name]);
    expect(oidcUserInfo.name).to.equal(firstName + 'StaleUser' + " User");
    expect(oidcUserInfo.given_name).to.equal(firstName + 'StaleUser');
    expect(oidcUserInfo.family_name).to.equal('User');
    I.resetRequestInterception();
    I.cleanupLetterHolderRoles(accessTokenClientSecret,oidcUserInfo.roles)
});
