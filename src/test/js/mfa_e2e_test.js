const randomData = require('./shared/random_data');
const TestData = require('./config/test_data');
const Welsh = require('./shared/welsh_constants');
const assert = require('assert');
const jwt_decode = require('jwt-decode');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('I am able to login with MFA');

let token;
let mfaUserEmail;
let mfaDisabledUserEmail;
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
    mfaDisabledUserEmail = randomData.getRandomEmailAddress();
    blockUserEmail = randomData.getRandomEmailAddress();

    blockPolicyName = `SIDM_TEST_POLICY_BLOCK_${randomData.getRandomString()}`;

    token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_mfaotptest_beta", 'beta description', '', token);
    const serviceBetaRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_mfaotptest_admin", 'admin description', serviceBetaRole, token);
    serviceAdminRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_mfaotptest_super", 'super description', serviceAdminRole, token);
    const serviceSuperRole = response.name;
    const serviceRoles = [serviceBetaRole, serviceAdminRole, serviceSuperRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceBetaRole, token, "openid profile roles create-user manage-user");
    serviceNames.push(serviceName);

    await I.createUserWithRoles(mfaUserEmail, randomUserFirstName, [serviceAdminRole, "IDAM_ADMIN_USER"]);
    userFirstNames.push(randomUserFirstName);

    await I.createUserWithRoles(mfaDisabledUserEmail, randomUserFirstName + "mfadisabled", [serviceAdminRole, "idam-mfa-disabled"]);
    userFirstNames.push(randomUserFirstName);

    await I.createUserWithRoles(blockUserEmail, randomUserFirstName, [serviceBetaRole]);
    userFirstNames.push(randomUserFirstName);

    await I.createPolicyForMfaBlockTest(blockPolicyName, serviceBetaRole, token);

    await I.createPolicyForApplicationMfaTest(serviceName, TestData.SERVICE_REDIRECT_URI, token);
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
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=openid profile roles manage-user create-user&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required', 10, 'h1');
    I.wait(5);
    const otpCode = await I.extractOtpFromEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Submit');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([serviceAdminRole, 'IDAM_ADMIN_USER']);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @welshLanguage I am able to login with MFA in Welsh', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&prompt=&response_type=code&scope=openid profile roles manage-user create-user${Welsh.urlForceCy}`;

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

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([serviceAdminRole, 'IDAM_ADMIN_USER']);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

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

Scenario('@functional @mfaLogin @mfaDisabledUserLogin As an mfa disabled user I can login without mfa for the application with mfa turned on', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=openid profile roles manage-user create-user&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaDisabledUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(0, jwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaDisabledUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName + 'mfadisabled');
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([serviceAdminRole, 'idam-mfa-disabled']);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaDisabledUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([serviceAdminRole, 'idam-mfa-disabled']);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'mfadisabled' + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'mfadisabled');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);