const randomData = require('./shared/random_data');
const TestData = require('./config/test_data');
const Welsh = require('./shared/welsh_constants');
const assert = require('assert');

Feature('I am able to login with MFA');

let token;
let mfaUserEmail;
let blockUserEmail;
let randomUserFirstName;
let serviceAdminRole;
let successMfaPolicyName;
let failMfaPolicyName;
let blockPolicyName;

let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    mfaUserEmail = randomData.getRandomEmailAddress();
    blockUserEmail = randomData.getRandomEmailAddress();

    successMfaPolicyName = `SIDM_TEST_POLICY_SUCCESS_MFA_${randomData.getRandomString()}`;
    failMfaPolicyName = `SIDM_TEST_POLICY_FAIL_MFA_${randomData.getRandomString()}`;
    blockPolicyName = `SIDM_TEST_POLICY_BLOCK_${randomData.getRandomString()}`;

    token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_beta", 'beta description', '', token);
    const serviceBetaRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_admin", 'admin description', serviceBetaRole, token);
    serviceAdminRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_super", 'super description', serviceAdminRole, token);
    const serviceSuperRole = response.name;
    const serviceRoles = [serviceBetaRole, serviceAdminRole, serviceSuperRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceBetaRole, token);
    serviceNames.push(serviceName);

    await I.createUserWithRoles(mfaUserEmail, randomUserFirstName, [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName);

    await I.createUserWithRoles(blockUserEmail, randomUserFirstName, [serviceBetaRole]);
    userFirstNames.push(randomUserFirstName);

    await I.createPolicyForMfaTest(successMfaPolicyName, serviceAdminRole, token);
    await I.createPolicyForMfaTest(failMfaPolicyName, serviceBetaRole, token);
    await I.createPolicyForMfaBlockTest(blockPolicyName, serviceBetaRole, token);
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX),
        I.deletePolicy(successMfaPolicyName, token),
        I.deletePolicy(failMfaPolicyName, token),
        I.deletePolicy(blockPolicyName, token)
    ]);
});

Scenario('@functional @mfaLogin I am able to login with MFA', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.saveScreenshot('mfa-verification.png');
    I.seeVisualDiff('mfa-verification.png', {tolerance: 6, prepareBaseImage: false});
    I.waitForText('Verification required', 10, 'h1');
    I.wait(5);
    const otpCode = await I.extractOtpFromEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Submit');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @welshLanguage I am able to login with MFA in Welsh', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signInOrCreateAccount, 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click(Welsh.signIn);
    I.seeInCurrentUrl("/verification");
    I.waitForText(Welsh.verificationRequired, 10, 'h1');
    I.wait(5);
    const otpEmailBody = await I.getEmail(mfaUserEmail);
    assert.equal(otpEmailBody.body.startsWith('Ysgrifennwyd'), true);
    const otpCode = await I.extractOtpFromEmailBody(otpEmailBody);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.submitBtn);
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);


Scenario('@functional @mfaLogin I am not able to login with MFA for the block policy ', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', blockUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.waitForText('Policies check failed', 10, 'h2');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin Validate verification code and 3 incorrect otp attempts should redirect user to the sign in page', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.waitInUrl("/verification", 20);
    I.waitForText('Verification required', 2, 'h1');
    I.wait(5);
    const otpCode = await I.extractOtpFromEmail(mfaUserEmail);

    // empty field
    I.fillField('code', '');
    I.click('Submit');
    I.waitForText('Enter a verification code', 5, '.error-message');
    // other than digits
    I.fillField('code', '663h8w7g');
    I.click('Submit');
    I.see('Enter numbers only');
    // not 8 digit otp
    I.fillField('code', `1${otpCode}`);
    I.click('Submit');
    I.see('Enter a valid verification code');
    // invalid otp
    I.fillField('code', '12345678');
    I.click('Submit');
    I.see('Verification code incorrect, try again');
    // invalid otp
    I.fillField('code', '74646474');
    I.click('Submit');
    I.see('Verification code incorrect, try again');

    // invalid otp
    I.fillField('code', '94837292');
    I.click('Submit');
    // after 3 incorrect attempts redirect user back to the sign in page
    I.seeInCurrentUrl("/login");
    I.see('Verification code check failed');
    I.see('Your verification code check has failed, please retry');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.waitInUrl('/verification', 20);
    I.waitForText('Verification required', 2, 'h1');

    const otpCodeLatest = await I.extractOtpFromEmail(mfaUserEmail);

    // previously generated otp should be invalidated
    I.fillField('code', otpCode);
    I.click('Submit');
    I.waitForText('Verification code incorrect, try again', 5, '.error-message');
    I.fillField('code', otpCodeLatest);
    I.interceptRequestsAfterSignin();
    I.click('Submit');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);