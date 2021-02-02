const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const assert = require('assert');
const Welsh = require('./shared/welsh_constants');

Feature('Self Registration');

const serviceName = randomData.getRandomServiceName();
const citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
let staleUserEmail = 'stale.' + randomData.getRandomEmailAddress();
let randomUserFirstName;
let randomUserLastName;
let userFirstNames = [];
let serviceNames = [];
let specialCharacterPassword;

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    randomUserLastName = randomData.getRandomUserName();
    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(citizenEmail, randomUserFirstName, ["citizen"]);
    userFirstNames.push(randomUserFirstName);
    specialCharacterPassword = 'New%%%&&&234';
    await I.createUserWithRoles(staleUserEmail, randomUserFirstName + 'Stale', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Stale');
    await I.retireStaleUser(staleUserEmail)
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional @selfregister User Validation errors', (I) => {

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');
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
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.waitForText('Sign in', 20, 'h1');
    I.see('Sign in');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @welshLanguage Account already created (no language)', async (I) => {

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmail);
    I.click("Continue");

    I.waitForText('Check your email', 20, 'h1');

    I.wait(5);
    const emailResponse = await I.getEmail(citizenEmail);
    assert.equal('You already have an account', emailResponse.subject);

});

Scenario('@functional @selfregister @welshLanguage Account already created (force Welsh)', async (I) => {

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl + Welsh.urlForceCy);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText(Welsh.createAnAccountOrSignIn, 20, 'h1');

    let cookie = await I.grabCookie(Welsh.localeCookie);
    assert(cookie.value, 'cy');

    I.see(Welsh.createAnAccount);
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmail);
    I.click(Welsh.continueBtn);

    I.waitForText(Welsh.checkYourEmail, 20, 'h1');

    I.wait(5);
    const emailResponse = await I.getEmail(citizenEmail);
    assert.equal(Welsh.youAlreadyHaveAccountSubject, emailResponse.subject);

});

Scenario('@functional @selfregister @welshLanguage I can self register (no language)', async (I) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.clearCookie(Welsh.localeCookie);
    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', email);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister @welshLanguage I can self register (Welsh)', async (I) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.amOnPage(selfRegUrl + Welsh.urlForceCy);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText(Welsh.createAnAccountOrSignIn, 20, 'h1');

    I.see(Welsh.createAnAccount);
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click(Welsh.continueBtn);
    I.waitForText(Welsh.checkYourEmail, 20, 'h1');
    I.wait(5);
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText(Welsh.createAPassword, 20, 'h1');
    I.seeTitleEquals(Welsh.userActivationTitle);
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click(Welsh.continueBtn);
    I.waitForText(Welsh.accountCreated, 20, 'h1');
    I.see(Welsh.youCanNowSignIn);
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText(Welsh.signInOrCreateAccount, 20, 'h1');
    I.fillField('#username', email);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.signIn);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister I can self register and cannot use activation link again', async (I) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');

    I.wait(3);
    I.amOnPage(userActivationUrl);
    I.waitForText('Your account is already activated.', 40, 'h1');
});


Scenario('@functional @selfregister @prePopulatedScreen I can self register with pre-populated user account screen', async (I) => {
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;
    const randomUserEmailAddress = 'citizen.' + randomData.getRandomEmailAddress();
    const userAccountDetails = {
        firstName: randomUserFirstName,
        lastName: randomUserLastName,
        email: randomUserEmailAddress
    };
    const base64EncodedJsonObject = await I.getBase64FromJsonObject(JSON.stringify(userAccountDetails));

    I.amOnPage(`${selfRegUrl}&form_data=${base64EncodedJsonObject}`);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');

    I.seeInField('firstName', randomUserFirstName);
    I.seeInField('lastName', randomUserLastName);
    I.seeInField('email', randomUserEmailAddress);

    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    I.wait(5);
    const userActivationUrl = await I.extractUrl(randomUserEmailAddress);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', randomUserEmailAddress);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister I can self register with repeated special characters in password', async (I) => {

    const email = 'test_citizen.' + randomData.getRandomEmailAddress();
    const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=selfreg`;

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', specialCharacterPassword);
    I.fillField('#password2', specialCharacterPassword);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');
    I.amOnPage(loginPage);
    I.seeInCurrentUrl("state=selfreg");
    I.waitForText('Sign in or create an account', 20, 'h1');
    I.fillField('#username', email);
    I.fillField('#password', specialCharacterPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
});

Scenario('@functional @selfregister @passwordvalidation Validation displayed when I try to create my password with a blacklisted/invalid password', async (I) => {

    const email = 'test_citizen2.' + randomData.getRandomEmailAddress();

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', email);
    I.click("Continue");
    I.waitForText('Check your email', 20, 'h1');
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('password1', 'Passw0rd');
    I.fillField('password2', 'Passw0rd');
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Your password is too easy to guess");
    I.fillField('password1', `${randomUserFirstName}Other6mKjmC`);
    I.fillField('password2', `${randomUserFirstName}Other6mKjmC`);
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', `${email}3ksTys`);
    I.fillField('password2', `${email}3ksTys`);
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Do not include your name or email in your password");
    I.fillField('password1', 'passwordidamtest');
    I.fillField('password2', 'passwordidamtest');
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see('Your password didn\'t have all the required characters');
    I.fillField('password1', 'Lincoln1');
    I.fillField('password2', 'Lincoln1');
    I.click('Continue');
    I.waitForText('There was a problem with the password you entered', 20, 'h2');
    I.see("Your password is too easy to guess");
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister @staleuserregister stale user should get you already have an account email', async (I) => {

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', staleUserEmail);
    I.click("Continue");

    I.waitForText('Check your email', 20, 'h1');

    I.wait(5);
    const emailResponse = await I.getEmail(staleUserEmail);
    assert.equal('You already have an account', emailResponse.subject);

});