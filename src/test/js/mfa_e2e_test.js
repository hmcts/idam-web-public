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

const scope="openid profile roles manage-user create-user";
let token;
let mfaUserEmail;
let mfaDisabledUserEmail;
let randomUserFirstName;
let mfaTurnedOnServiceRole;
let mfaTurnedOffServiceRole;
let mfaApplicationPolicyName;
let mfaTurnedOnService;
let mfaTurnedOffService;

BeforeSuite(async (I) => {
    randomUserFirstName = randomData.getRandomUserName();
    mfaUserEmail = randomData.getRandomEmailAddress();
    mfaDisabledUserEmail = randomData.getRandomEmailAddress();

    token = await I.getAuthToken();

    mfaTurnedOnServiceRole = await I.createRole(randomData.getRandomRoleName() + "_mfaotptest_admin", 'admin description', '', token);
    mfaTurnedOnService = await I.createNewServiceWithRoles(randomData.getRandomServiceName(), [mfaTurnedOnServiceRole.id], '', token, "openid profile roles create-user manage-user");

    mfaTurnedOffServiceRole = await I.createRole(randomData.getRandomRoleName() + "_mfaotptest", 'admin description', '', token);
    mfaTurnedOffService = await I.createNewServiceWithRoles(randomData.getRandomServiceName(), [mfaTurnedOffServiceRole.id], '', token, "openid profile roles create-user manage-user");

    await I.createUserWithRoles(mfaUserEmail, randomUserFirstName, [mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);
    await I.createUserWithRoles(mfaDisabledUserEmail, randomUserFirstName + "mfadisabled", [mfaTurnedOnServiceRole.name, "idam-mfa-disabled"]);

    mfaApplicationPolicyName = `MfaByApplicationPolicy-${mfaTurnedOnService.oauth2ClientId}`;
    await I.createPolicyForApplicationMfaTest(mfaApplicationPolicyName, mfaTurnedOnService.activationRedirectUrl, token);
});

AfterSuite(async (I) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX),
        I.deletePolicy(mfaApplicationPolicyName, token),
    ]);
});

Scenario('@functional @mfaLogin I am able to login with MFA', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIhsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=openid profile roles manage-user create-user&prompt=`;

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
    I.click('Continue');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, mfaTurnedOffServiceRole.id]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @welshLanguage I am able to login with MFA in Welsh', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6wtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&prompt=&response_type=code&scope=openid profile roles manage-user create-user${Welsh.urlForceCy}`;

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
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, mfaTurnedOffServiceRole.id]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin Validate verification code and 3 incorrect otp attempts should redirect user to the sign in page', async (I) => {
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}`;

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
    I.click('Continue');
    I.waitForText('Enter a correct verification code', 5, '.error-message');
    // other than digits
    I.fillField('code', '663h8w7g');
    I.click('Continue');
    I.see('Enter a correct verification code');
    // not 8 digit otp
    I.fillField('code', `1${otpCode}`);
    I.click('Continue');
    I.see('Enter a correct verification code');
    // invalid otp
    I.fillField('code', '12345678');
    I.click('Continue');
    I.see('Enter a correct verification code');
    // invalid otp
    I.fillField('code', '74646474');
    I.click('Continue');
    I.see('Enter a correct verification code');

    // invalid otp
    I.fillField('code', '94837292');
    I.click('Continue');
    // after 3 incorrect attempts redirect user back to the sign in page
    I.seeInCurrentUrl("/expiredcode");
    I.see('We’ve been unable to sign you in because your verification code has expired.');
    I.see('You’ll need to start again.');
    I.click('Continue');

    I.seeInCurrentUrl("/login");
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.waitInUrl('/verification', 20);
    I.waitForText('Verification required', 2, 'h1');

    const otpCodeLatest = await I.extractOtpFromEmail(mfaUserEmail);

    // previously generated otp should be invalidated
    I.fillField('code', otpCode);
    I.click('Continue');
    I.waitForText('Enter a correct verification code', 5, '.error-message');
    I.fillField('code', otpCodeLatest);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaDisabledUserLogin As a mfa disabled user I can login without mfa for the application with mfa turned on', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgtUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=openid profile roles manage-user create-user&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaDisabledUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, TestData.SERVICE_CLIENT_SECRET);

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
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, 'idam-mfa-disabled']);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaDisabledUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, 'idam-mfa-disabled']);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'mfadisabled' + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'mfadisabled');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login with client A MFA turned OFF and then step-up to client B with MFA turned ON', async (I) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOffService.activationRedirectUrl}&client_id=${mfaTurnedOffService.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOffService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing with the Idam session cookie for the client MFA turned ON
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    location.includes(`/login?client_id=${mfaTurnedOnService.oauth2ClientId}&redirect_uri=${mfaTurnedOnService.activationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', TestData.PASSWORD);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required', 10, 'h1');
    I.wait(5);
    const otpCode = await I.extractOtpFromEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.click('Submit');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, TestData.SERVICE_CLIENT_SECRET);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(accessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, mfaTurnedOffServiceRole.id]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.id, mfaTurnedOffServiceRole.id]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});