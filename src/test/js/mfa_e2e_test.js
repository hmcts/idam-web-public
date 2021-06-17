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
const testSuitePrefix = randomData.getRandomAlphabeticString();
const userPassword=randomData.getRandomUserPassword();
const serviceClientSecret = randomData.getRandomClientSecret();
let token;
let mfaUserEmail;
let mfaDisabledUserEmail;
let randomUserFirstName;
let mfaTurnedOnServiceRole;
let mfaTurnedOffServiceRole;
let mfaApplicationPolicyName;
let mfaTurnedOnService1;
let mfaTurnedOffService1;
let mfaTurnedOnService2;
let mfaTurnedOffService2;

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    mfaUserEmail = randomData.getRandomEmailAddress();
    mfaDisabledUserEmail = randomData.getRandomEmailAddress();

    token = await I.getAuthToken();

    mfaTurnedOnServiceRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_mfaotptest_admin", 'admin description', '', token);
    mfaTurnedOnService1 = await I.createNewServiceWithRoles(randomData.getRandomServiceName(testSuitePrefix), serviceClientSecret,  [mfaTurnedOnServiceRole.name], '', token, scope);

    mfaTurnedOffServiceRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_mfaotptest", 'admin description', '', token);
    mfaTurnedOffService1 = await I.createNewServiceWithRoles(randomData.getRandomServiceName(testSuitePrefix), serviceClientSecret, [mfaTurnedOffServiceRole.name], '', token, scope);

    mfaTurnedOnService2 = await I.createNewServiceWithRoles(randomData.getRandomServiceName(testSuitePrefix), serviceClientSecret, [mfaTurnedOnServiceRole.name], '', token, scope);
    mfaTurnedOffService2 = await I.createNewServiceWithRoles(randomData.getRandomServiceName(testSuitePrefix), serviceClientSecret, [mfaTurnedOffServiceRole.name], '', token, scope);

    await I.createUserWithRoles(mfaUserEmail, userPassword, randomUserFirstName, [mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);
    await I.createUserWithRoles(mfaDisabledUserEmail, userPassword, randomUserFirstName + "mfadisabled", [mfaTurnedOnServiceRole.name, "idam-mfa-disabled"]);

    mfaApplicationPolicyName = `MfaByApplicationPolicy-${mfaTurnedOnService1.oauth2ClientId}`;
    await I.createPolicyForApplicationMfaTest(mfaApplicationPolicyName, mfaTurnedOnService1.activationRedirectUrl, token);
});

AfterSuite(async ({ I }) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix),
        I.deletePolicy(mfaApplicationPolicyName, token),
    ]);
});

Scenario('@functional @mfaLogin I am able to login with MFA', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIhsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @welshLanguage I am able to login with MFA in Welsh', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6wtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&prompt=&response_type=code&scope=${scope}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signInOrCreateAccount);
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click(Welsh.signIn);
    I.seeInCurrentUrl("/verification");
    I.waitForText(Welsh.verificationRequired);
    const otpEmailBody = await I.getEmailFromNotify(mfaUserEmail);
    assert.equal(otpEmailBody.body.startsWith('Ysgrifennwyd'), true);
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click(Welsh.submitBtn);
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

    let jwtDecode = await jwt_decode(accessToken);

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);
    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin Validate verification code and 3 incorrect otp attempts otp expired message and continue button should be present', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIhsUVTutbVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm5ed0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.waitInUrl("/verification");
    I.waitForText('Verification required');
    await I.runAccessibilityTest();
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    // empty field
    I.fillField('code', '');
    await I.runAccessibilityTest();
    I.click('Continue');
    I.waitForText('Enter a correct verification code');
    // other than digits
    await I.runAccessibilityTest();
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
    // after 3 incorrect attempts, user should start the login/journey again.
    I.seeInCurrentUrl("/expiredcode");
    await I.runAccessibilityTest();
    I.see('We’ve been unable to sign you in because your verification code has expired.');
    I.see('You’ll need to start again.');
    I.click('Continue');

    I.seeInCurrentUrl("/login");
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.waitInUrl('/verification');
    I.waitForText('Verification required');

    const otpCodeLatest = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    // previously generated otp should be invalidated
    I.fillField('code', otpCode);
    I.click('Continue');
    I.waitForText('Enter a correct verification code');
    I.fillField('code', otpCodeLatest);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaDisabledUserLogin As a mfa disabled user I can login without mfa for the application with mfa turned on', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgtUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaDisabledUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

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
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, 'idam-mfa-disabled']);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaDisabledUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, 'idam-mfa-disabled']);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + 'mfadisabled' + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName + 'mfadisabled');
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to the MFA turned off service and then step-up login to the MFA turned on service', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOffService1.activationRedirectUrl}&client_id=${mfaTurnedOffService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOffService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOnService1.oauth2ClientId}&redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

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
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to a mfa turned on service and then login to a mfa turned off service', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnServicePageSource = await I.grabSource();
    const mfaturnedOnServiceCode = mfaturnedOnServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnServiceAccessToken = await I.getAccessToken(mfaturnedOnServiceCode, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

    let mfaturnedOnServiceJwtDecode = await jwt_decode(mfaturnedOnServiceAccessToken);

    assert.equal("access_token", mfaturnedOnServiceJwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnServiceJwtDecode.nonce);
    assert.equal(1, mfaturnedOnServiceJwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned off service with the Idam session cookie from mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService1.oauth2ClientId, mfaTurnedOffService1.activationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`${mfaTurnedOffService1.activationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOffService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOffServicePageSource = await I.grabSource();
    const mfaturnedOffServiceCode = mfaturnedOffServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOffServiceAccessToken = await I.getAccessToken(mfaturnedOffServiceCode, mfaTurnedOffService1.oauth2ClientId, mfaTurnedOffService1.activationRedirectUrl, serviceClientSecret);

    let mfaturnedOffServiceJwtDecode = await jwt_decode(mfaturnedOffServiceAccessToken);

    assert.equal("access_token", mfaturnedOffServiceJwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOffServiceJwtDecode.nonce);
    assert.equal(1, mfaturnedOffServiceJwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(mfaturnedOffServiceAccessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(mfaturnedOffServiceAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to a mfa turned on service and then login to a another mfa turned on service', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}&client_id=${mfaTurnedOnService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnService1PageSource = await I.grabSource();
    const mfaturnedOnService1Code = mfaturnedOnService1PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnService1AccessToken = await I.getAccessToken(mfaturnedOnService1Code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService1JwtDecode = await jwt_decode(mfaturnedOnService1AccessToken);

    assert.equal("access_token", mfaturnedOnService1JwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnService1JwtDecode.nonce);
    assert.equal(1, mfaturnedOnService1JwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from another mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService2.oauth2ClientId, mfaTurnedOnService2.activationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`${mfaTurnedOnService2.activationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOnService2.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOnService2PageSource = await I.grabSource();
    const mfaTurnedOnService2Code = mfaTurnedOnService2PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOnService2AccessToken = await I.getAccessToken(mfaTurnedOnService2Code, mfaTurnedOnService2.oauth2ClientId, mfaTurnedOnService2.activationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService2JwtDecode = await jwt_decode(mfaTurnedOnService2AccessToken);

    assert.equal("access_token", mfaturnedOnService2JwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnService2JwtDecode.nonce);
    assert.equal(1, mfaturnedOnService2JwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(mfaTurnedOnService2AccessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(mfaTurnedOnService2AccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to the MFA turned off service and then login to another MFA turned off service', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOffService1.activationRedirectUrl}&client_id=${mfaTurnedOffService1.oauth2ClientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOffService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOffService1PageSource = await I.grabSource();
    const mfaTurnedOffService1Code = mfaTurnedOffService1PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOffService1AccessToken = await I.getAccessToken(mfaTurnedOffService1Code, mfaTurnedOffService1.oauth2ClientId, mfaTurnedOffService1.activationRedirectUrl, serviceClientSecret);

    let mfaTurnedOffService1JwtDecode = await jwt_decode(mfaTurnedOffService1AccessToken);

    assert.equal("access_token", mfaTurnedOffService1JwtDecode.tokenName);
    assert.equal(nonce, mfaTurnedOffService1JwtDecode.nonce);
    assert.equal(0, mfaTurnedOffService1JwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService2.oauth2ClientId, mfaTurnedOffService2.activationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`${mfaTurnedOffService2.activationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOffService2.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOffService2PageSource = await I.grabSource();
    const mfaTurnedOffService2Code = mfaTurnedOffService2PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOffService2AccessToken = await I.getAccessToken(mfaTurnedOffService2Code, mfaTurnedOffService2.oauth2ClientId, mfaTurnedOffService2.activationRedirectUrl, serviceClientSecret);

    let mfaTurnedOffService2JwtDecode = await jwt_decode(mfaTurnedOffService2AccessToken);

    assert.equal("access_token", mfaTurnedOffService2JwtDecode.tokenName);
    assert.equal(nonce, mfaTurnedOffService2JwtDecode.nonce);
    assert.equal(0, mfaTurnedOffService2JwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(mfaTurnedOffService2AccessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(mfaTurnedOffService2AccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin As a user, I can login to the MFA turned on service with invalid cookie', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const cookie = "invalidcookie" + randomData.getRandomString();

    // try authorizing to the mfa turned on service with the invalid Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOnService1.oauth2ClientId}&redirect_uri=${mfaTurnedOnService1.activationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(mfaTurnedOnService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.oauth2ClientId, mfaTurnedOnService1.activationRedirectUrl, serviceClientSecret);

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
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});

Scenario('@functional @mfaLogin As a user, I can login to the mfa turned off service with invalid cookie ', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const cookie = "invalidcookie" + randomData.getRandomString();

    // try authorizing to the mfa turned off service with the invalid Idam session cookie from mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService1.oauth2ClientId, mfaTurnedOffService1.activationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOffService1.oauth2ClientId}&redirect_uri=${mfaTurnedOffService1.activationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOffService1.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOffServicePageSource = await I.grabSource();
    const mfaturnedOffServiceCode = mfaturnedOffServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOffServiceAccessToken = await I.getAccessToken(mfaturnedOffServiceCode, mfaTurnedOffService1.oauth2ClientId, mfaTurnedOffService1.activationRedirectUrl, serviceClientSecret);

    let mfaturnedOffServiceJwtDecode = await jwt_decode(mfaturnedOffServiceAccessToken);

    assert.equal("access_token", mfaturnedOffServiceJwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOffServiceJwtDecode.nonce);
    assert.equal(0, mfaturnedOffServiceJwtDecode.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(mfaturnedOffServiceAccessToken);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(mfaturnedOffServiceAccessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
});
