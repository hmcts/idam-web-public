const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');
const assert = require('assert');

Feature('Self Registration');

const serviceName = randomData.getRandomServiceName();
const citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();
let randomUserFirstName;
let randomUserLastName;
let userFirstNames = [];
let serviceNames = [];

const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    randomUserLastName = randomData.getRandomUserName();
    await I.createServiceData(serviceName);
    serviceNames.push(serviceName);
    await I.createUserWithRoles(citizenEmail, randomUserFirstName, ["citizen"]);
    userFirstNames.push(randomUserFirstName);
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
    I.wait(5);
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.wait(5);
    I.see('Your email address is invalid');
    I.fillField('firstName', 'L');
    I.fillField('lastName', '@@');
    I.click('Continue');
    I.wait(5);
    I.see('Your first name is invalid');
    I.see('First name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Your last name is invalid');
    I.see('Last name has to be longer than 1 character and should not include digits nor any of these characters:')
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.waitForText('Sign in', 20, 'h1');
    I.see('Sign in');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @selfregister Account already created', async (I) => {

    I.amOnPage(selfRegUrl);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');

    I.see('Create an account');
    I.fillField('firstName', randomUserFirstName);
    I.fillField('lastName', randomUserLastName);
    I.fillField('email', citizenEmail);
    I.click("Continue");

    I.waitForText('Check your email', 20, 'h1');

    I.wait(10);
    const emailResponse = await I.getEmail(citizenEmail);
    assert.equal('You already have an account', emailResponse.subject);

});

Scenario('@functional @selfregister I can self register', async (I) => {

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
    I.wait(10);
    const userActivationUrl = await I.extractUrl(email);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.wait(5);
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
    I.wait(10);
    const userActivationUrl = await I.extractUrl(randomUserEmailAddress);
    I.amOnPage(userActivationUrl);
    I.waitForText('Create a password', 20, 'h1');
    I.seeTitleEquals('User Activation - HMCTS Access');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.wait(5);
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