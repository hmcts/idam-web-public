const randomData = require('./shared/random_data');
const TestData = require('./config/test_data');

Feature('I am able to login with MFA');

let token;
let adminUserEmail;
let randomUserFirstName;
let policyName;

let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    adminUserEmail = randomData.getRandomEmailAddress();
    policyName = `SIDM_TEST_POLICY_MFA_${randomData.getRandomString()}`;

    token = await I.getAuthToken();
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

    await I.createUserWithRoles(adminUserEmail, randomUserFirstName, [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName);

    await I.createPolicyForMfaTest(policyName, serviceAdminRole, token);
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX),
        I.deletePolicy(policyName, token),
    ]);
});

Scenario('@functional @mfaLogin I am able to login with MFA', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', adminUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(10);
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required', 10, 'h1');

    const otpCode = await I.extractOtpFromEmail(adminUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Submit');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin Validate verification code and 3 incorrect otp attempts should redirect user to the sign in page', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', adminUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(10);
    I.seeInCurrentUrl("verification");
    I.waitForText('Verification required', 2, 'h1');

    const otpCode = await I.extractOtpFromEmail(adminUserEmail);

    // empty field
    I.fillField('code', '');
    I.click('Submit');
    I.wait(5);
    I.waitForText('Enter a verification code', 5, '.error-message');
    // other than digits
    I.fillField('code', '663h8w7g');
    I.click('Submit');
    I.wait(3);
    I.see('Enter numbers only');
    // not 8 digit otp
    I.fillField('code', `1${otpCode}`);
    I.click('Submit');
    I.wait(3);
    I.see('Enter a valid verification code');
    // invalid otp
    I.fillField('code', '12345678');
    I.click('Submit');
    I.wait(3);
    I.see('Verification code incorrect, try again');
    // invalid otp
    I.fillField('code', '74646474');
    I.click('Submit');
    I.wait(3);
    I.see('Verification code incorrect, try again');

    // invalid otp
    I.fillField('code', '94837292');
    I.click('Submit');
    I.wait(10);
    // after 3 incorrect attempts redirect user back to the sign in page
    I.waitInUrl('/login', 5);
    I.see('Verification code check failed');
    I.see('Your verification code check has failed, please retry');
    I.fillField('#username', adminUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.wait(10);
    I.seeInCurrentUrl('verification');
    I.waitForText('Verification required', 2, 'h1');

    const otpCodeLatest = await I.extractOtpFromEmail(adminUserEmail);

    // previously generated otp should be invalidated
    I.fillField('code', otpCode);
    I.click('Submit');
    I.wait(5);
    I.waitForText('Verification code incorrect, try again', 5, '.error-message');
    I.fillField('code', otpCodeLatest);
    I.interceptRequestsAfterSignin();
    I.click('Submit');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);
