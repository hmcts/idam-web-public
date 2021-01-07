const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('I am able to uplift a user');

let randomUserFirstName;
let randomUserLastName;
let citizenEmail;
let existingCitizenEmail;
let upliftAccountCreationStaleUserEmail;
let upliftLoginStaleUserEmail;
let accessToken;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];
const pinUserRolePrefix = 'letter-';
let serviceBetaRole;

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    randomUserLastName = randomData.getRandomUserName() + 'pinępinç';
    randomUserFirstName = randomData.getRandomUserName() + 'ępinçłpin';
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
    existingCitizenEmail = 'existingcitizen.' + randomData.getRandomEmailAddress();
    upliftAccountCreationStaleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();
    upliftLoginStaleUserEmail = 'staleuser.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    serviceBetaRole = await I.createRole(randomData.getRandomRoleName() + "_beta", 'beta description', '', token);
    let serviceAdminRole = await I.createRole(randomData.getRandomRoleName() + "_admin", 'admin description', serviceBetaRole.id, token);
    let serviceSuperRole = await I.createRole(randomData.getRandomRoleName() + "_super", 'super description', serviceAdminRole.id, token);

    let serviceRoleNames = [serviceBetaRole.name, serviceAdminRole.name, serviceSuperRole.name];
    let serviceRoleIds = [serviceBetaRole.id, serviceAdminRole.id, serviceSuperRole.id];
    roleNames.push(serviceRoleNames);

    await I.createServiceWithRoles(serviceName, serviceRoleIds, serviceBetaRole.id, token);
    serviceNames.push(serviceName);

    await I.createUserWithRoles(existingCitizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');

    await I.createUserWithRoles(upliftAccountCreationStaleUserEmail, randomUserFirstName + 'StaleUser', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUser');
    await I.retireStaleUser(upliftAccountCreationStaleUserEmail);

    await I.createUserWithRoles(upliftLoginStaleUserEmail, randomUserFirstName + 'StaleUser', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'StaleUser');
    await I.retireStaleUser(upliftLoginStaleUserEmail);

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


Scenario('@functional @uplift @staleUserUpliftAccountCreation Send stale user registration for stale user uplift account creation', async (I) => {
    const pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;

    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    const response = await I.getUserByEmail(upliftAccountCreationStaleUserEmail);
    const userId = response.id;

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/login/uplift?client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&jwt=${accessToken}`);
    I.waitForText('Create an account or sign in', 30, 'h1');
    I.fillField('#firstName', randomUserFirstName);
    I.fillField('#lastName', randomUserLastName);
    I.fillField('#username', upliftAccountCreationStaleUserEmail.toUpperCase());
    I.scrollPageToBottom();
    I.click('Continue');
    I.wait(5);
    I.waitForText('You need to reset your password', 20, 'h2');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.', 20);
    const reRegistrationUrl = await I.extractUrl(upliftAccountCreationStaleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.');

    const responseAfterAccountReActivation = await I.getUserByEmail(upliftAccountCreationStaleUserEmail);
    expect(responseAfterAccountReActivation.id).to.equal(userId);
    expect(responseAfterAccountReActivation.forename).to.equal(randomUserFirstName + 'StaleUser');
    expect(responseAfterAccountReActivation.surname).to.equal('User');
    expect(responseAfterAccountReActivation.email).to.equal(upliftAccountCreationStaleUserEmail);
    expect(responseAfterAccountReActivation.active).to.equal(true);
    expect(responseAfterAccountReActivation.stale).to.equal(false);
    expect(responseAfterAccountReActivation.roles).to.eql(['citizen']);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account', 30, 'h1');
    I.fillField('#username', upliftAccountCreationStaleUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const loginCode = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const loginAccessToken = await I.getAccessToken(loginCode, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(loginAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(upliftAccountCreationStaleUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.equal(userId);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([pinUserRole, 'citizen', serviceBetaRole]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'StaleUser' + " User");
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'StaleUser');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @uplift @staleUserUpliftLogin Send stale user registration for stale user uplift account creation', async (I) => {
    const pinUser = await I.getPinUser(randomUserFirstName, randomUserLastName);
    let pinUserRole = pinUserRolePrefix + pinUser.userId;

    const code = await I.loginAsPin(pinUser.pin, serviceName, TestData.SERVICE_REDIRECT_URI);
    accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    const response = await I.getUserByEmail(upliftLoginStaleUserEmail);
    const userId = response.id;

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account', 30, 'h1');
    I.fillField('#username', upliftLoginStaleUserEmail.toUpperCase());
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(5);
    I.waitForText('You need to reset your password', 20, 'h2');
    I.waitForText('As you\'ve not logged in for at least 90 days, you need to reset your password.', 20);
    const reRegistrationUrl = await I.extractUrl(upliftLoginStaleUserEmail);
    I.amOnPage(reRegistrationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Your password has been changed', 20, 'h1');
    I.see('You can now sign in with your new password.');

    const responseAfterAccountReActivation = await I.getUserByEmail(upliftLoginStaleUserEmail);
    expect(responseAfterAccountReActivation.id).to.equal(userId);
    expect(responseAfterAccountReActivation.forename).to.equal(randomUserFirstName + 'StaleUser');
    expect(responseAfterAccountReActivation.surname).to.equal('User');
    expect(responseAfterAccountReActivation.email).to.equal(upliftLoginStaleUserEmail);
    expect(responseAfterAccountReActivation.active).to.equal(true);
    expect(responseAfterAccountReActivation.stale).to.equal(false);
    expect(responseAfterAccountReActivation.roles).to.eql(['citizen']);

    I.amOnPage(`${TestData.WEB_PUBLIC_URL}/register?redirect_uri=${encodeURIComponent(TestData.SERVICE_REDIRECT_URI).toLowerCase()}&client_id=${serviceName}&jwt=${accessToken}`);
    I.waitForText('Sign in or create an account', 30, 'h1');
    I.fillField('#username', upliftLoginStaleUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const loginCode = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const loginAccessToken = await I.getAccessToken(loginCode, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(loginAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(upliftLoginStaleUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.equal(userId);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([pinUserRole, 'citizen', serviceBetaRole]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'StaleUser' + " User");
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'StaleUser');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});
