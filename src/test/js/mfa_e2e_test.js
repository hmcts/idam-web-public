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
let accessTokenClientSecret;
let scopes = ["openid", "profile", "roles","manage-user","create-user" ];

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    mfaUserEmail = randomData.getRandomEmailAddress();
    mfaDisabledUserEmail = randomData.getRandomEmailAddress();

    token = await I.getToken();

    mfaTurnedOnServiceRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_mfaotptest_admin", 'admin description', [], token);
    let serviceName = randomData.getRandomServiceName(testSuitePrefix)
    mfaTurnedOnService1 = await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [mfaTurnedOnServiceRole.name], token,scopes,[],true,`https://www.${serviceName}.com`) ;
    serviceName = randomData.getRandomServiceName(testSuitePrefix)
    mfaTurnedOffServiceRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_mfaotptest", 'admin description', [], token);
    mfaTurnedOffService1 = await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [mfaTurnedOffServiceRole.name], token,scopes,[],false,`https://www.${serviceName}.com`) ;
    serviceName = randomData.getRandomServiceName(testSuitePrefix)
    mfaTurnedOnService2 = await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [mfaTurnedOnServiceRole.name], token,scopes,[],true,`https://www.${serviceName}.com`) ;
    serviceName = randomData.getRandomServiceName(testSuitePrefix)
    mfaTurnedOffService2 = await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret, [mfaTurnedOffServiceRole.name], token,scopes,[],false,`https://www.${serviceName}.com`) ;

    accessTokenClientSecret = await I.getAccessTokenClientSecret(mfaTurnedOnService1.clientId, serviceClientSecret);
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, mfaUserEmail, userPassword, randomUserFirstName, [mfaTurnedOnServiceRole.name, mfaTurnedOffServiceRole.name]);
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, mfaDisabledUserEmail, userPassword, randomUserFirstName + "mfadisabled", [mfaTurnedOnServiceRole.name, "idam-mfa-disabled"]);

    // mfaApplicationPolicyName = `MfaByApplicationPolicy-${mfaTurnedOnService1.oauth2ClientId}`;
    // await I.createPolicyForApplicationMfaTest(mfaApplicationPolicyName, mfaTurnedOnService1.activationRedirectUrl, token);

    I.wait(0.5);
});



Scenario('@functional @mfaLogin  I am able to login with MFA', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIhsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Continue');
    let currentUrl = await I.grabCurrentUrl();
    I.addMochawesomeContext('Url is ' + currentUrl);
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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

Scenario('@functional @mfaLogin  I am able to login with MFA and prompt = login', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIhsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=login`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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

Scenario('@functional @mfaLogin @welshLanguage  I am able to login with MFA in Welsh', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6wtIgsUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&prompt=&response_type=code&scope=${scope}${Welsh.urlForceCy}`;

    I.amOnPage(loginUrl);
    I.waitForText(Welsh.signInOrCreateAccount);
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait(Welsh.signIn);
    I.seeInCurrentUrl("/verification");
    I.waitForText(Welsh.verificationRequired);
    const otpEmailBody = await I.getEmailFromNotifyUsingTestingSupportService(accessTokenClientSecret, mfaUserEmail);
    assert.equal(otpEmailBody.body.startsWith('Ysgrifennwyd'), true);
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.clickWithWait(Welsh.submitBtn);
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    let pageSource = await I.grabSource();
    let code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    let accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm5ed0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitInUrl("/verification");
    I.waitForText('Verification required');
    await I.runAccessibilityTest();
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    // empty field
    I.fillField('code', '');
    await I.runAccessibilityTest();
    I.clickWithWait('Continue');
    I.waitForText('Enter a correct verification code');
    // other than digits
    await I.runAccessibilityTest();
    I.fillField('code', '663h8w7g');
    I.clickWithWait('Continue');
    I.see('Enter a correct verification code');
    // not 8 digit otp
    I.fillField('code', `1${otpCode}`);
    I.clickWithWait('Continue');
    I.see('Enter a correct verification code');
    // invalid otp
    I.fillField('code', '12345678');
    I.clickWithWait('Continue');
    I.see('Enter a correct verification code');
    // invalid otp
    I.fillField('code', '74646474');
    I.clickWithWait('Continue');
    I.see('Enter a correct verification code');

    // invalid otp
    I.fillField('code', '94837292');
    I.clickWithWait('Continue');
    // after 3 incorrect attempts, user should start the login/journey again.
    I.seeInCurrentUrl("/expiredcode");
    await I.runAccessibilityTest();
    I.see('We’ve been unable to sign you in because your verification code has expired.');
    I.see('You’ll need to start again.');
    I.clickWithWait('Continue');

    I.seeInCurrentUrl("/login");
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.waitInUrl('/verification');
    I.waitForText('Verification required');

    const otpCodeLatest = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    // previously generated otp should be invalidated
    I.fillField('code', otpCode);
    I.clickWithWait('Continue');
    I.waitForText('Enter a correct verification code');
    I.fillField('code', otpCodeLatest);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');
    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaDisabledUserLogin As a mfa disabled user I can login without mfa for the application with mfa turned on', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgtUVTGybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaDisabledUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    let currentUrl = await I.grabCurrentUrl();
    I.addMochawesomeContext('Url is ' + currentUrl);
    I.dontSeeInCurrentUrl("/verification");
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to the MFA turned off service and then step-up login to the MFA turned on service', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOffService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOnService1.clientId}&redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaStepUpLogin  As a user, I can login to a mfa turned on service and then login to a mfa turned off service', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnServicePageSource = await I.grabSource();
    const mfaturnedOnServiceCode = mfaturnedOnServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnServiceAccessToken = await I.getAccessToken(mfaturnedOnServiceCode, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaturnedOnServiceJwtDecode = await jwt_decode(mfaturnedOnServiceAccessToken);

    assert.equal("access_token", mfaturnedOnServiceJwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnServiceJwtDecode.nonce);
    assert.equal(1, mfaturnedOnServiceJwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned off service with the Idam session cookie from mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService1.clientId, mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`${mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOffServicePageSource = await I.grabSource();
    const mfaturnedOffServiceCode = mfaturnedOffServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOffServiceAccessToken = await I.getAccessToken(mfaturnedOffServiceCode, mfaTurnedOffService1.clientId, mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaStepUpLogin As a user, I can login to a mfa turned on service and then login to a another mfa turned on service', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnService1PageSource = await I.grabSource();
    const mfaturnedOnService1Code = mfaturnedOnService1PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnService1AccessToken = await I.getAccessToken(mfaturnedOnService1Code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService1JwtDecode = await jwt_decode(mfaturnedOnService1AccessToken);

    assert.equal("access_token", mfaturnedOnService1JwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnService1JwtDecode.nonce);
    assert.equal(1, mfaturnedOnService1JwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from another mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService2.clientId, mfaTurnedOnService2.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    console.log("Location: " + location);
    expect(location).to.includes(`${mfaTurnedOnService2.hmctsAccess.postActivationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOnService2.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOnService2PageSource = await I.grabSource();
    const mfaTurnedOnService2Code = mfaTurnedOnService2PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOnService2AccessToken = await I.getAccessToken(mfaTurnedOnService2Code, mfaTurnedOnService2.clientId, mfaTurnedOnService2.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin @mfaStepUpLogin  As a user, I can login to the MFA turned off service and then login to another MFA turned off service', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOffService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOffService1PageSource = await I.grabSource();
    const mfaTurnedOffService1Code = mfaTurnedOffService1PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOffService1AccessToken = await I.getAccessToken(mfaTurnedOffService1Code, mfaTurnedOffService1.clientId, mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaTurnedOffService1JwtDecode = await jwt_decode(mfaTurnedOffService1AccessToken);

    assert.equal("access_token", mfaTurnedOffService1JwtDecode.tokenName);
    assert.equal(nonce, mfaTurnedOffService1JwtDecode.nonce);
    assert.equal(0, mfaTurnedOffService1JwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    // try authorizing to the mfa turned on service with the Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService2.clientId, mfaTurnedOffService2.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`${mfaTurnedOffService2.hmctsAccess.postActivationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location);
    I.waitForText(mfaTurnedOffService2.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOffService2PageSource = await I.grabSource();
    const mfaTurnedOffService2Code = mfaTurnedOffService2PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOffService2AccessToken = await I.getAccessToken(mfaTurnedOffService2Code, mfaTurnedOffService2.clientId, mfaTurnedOffService2.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin  As a user, I can login to the MFA turned on service with invalid cookie', async ({ I }) => {
    const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const cookie = "invalidcookie" + randomData.getRandomString();

    // try authorizing to the mfa turned on service with the invalid Idam session cookie from mfa turned off service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOnService1.clientId}&redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin As a user, I can login to the mfa turned off service with invalid cookie ', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const cookie = "invalidcookie" + randomData.getRandomString();

    // try authorizing to the mfa turned off service with the invalid Idam session cookie from mfa turned on service
    const location = await I.getWebPublicOidcAuthorize(mfaTurnedOffService1.clientId, mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    expect(location).to.includes(`/login?client_id=${mfaTurnedOffService1.clientId}&redirect_uri=${mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl}`);

    I.amOnPage(location);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.waitForText(mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOffServicePageSource = await I.grabSource();
    const mfaturnedOffServiceCode = mfaturnedOffServicePageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOffServiceAccessToken = await I.getAccessToken(mfaturnedOffServiceCode, mfaTurnedOffService1.clientId, mfaTurnedOffService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

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
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaLogin  @mfaSkipStepUpLogin As a user, I can login to the MFA turned on service and then authorize to the same service with prompt=login and login again', async ({ I }) => {
    const nonce = "0km9sBgZfnXv8e_O7U-XmSR6vtIgsUVTXybVUdoLV7g";
    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}&client_id=${mfaTurnedOnService1.clientId}&state=44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode);
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnService1PageSource = await I.grabSource();
    const mfaturnedOnService1Code = mfaturnedOnService1PageSource.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnService1AccessToken = await I.getAccessToken(mfaturnedOnService1Code, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService1JwtDecode = await jwt_decode(mfaturnedOnService1AccessToken);

    assert.equal("access_token", mfaturnedOnService1JwtDecode.tokenName);
    assert.equal(nonce, mfaturnedOnService1JwtDecode.nonce);
    assert.equal(1, mfaturnedOnService1JwtDecode.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie = await I.grabCookie('Idam.Session');
    const cookie = idamSessionCookie.value;

    const authLocation = await I.getWebPublicOidcAuthorizeWithLoginRequired(mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie);
    expect(authLocation).to.includes(`/login?client_id=${mfaTurnedOnService1.clientId}&redirect_uri=${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}`);

    I.amOnPage(authLocation);
    I.waitForText('Sign in');
    I.fillField('#username', mfaUserEmail);
    I.fillField('#password', userPassword);
    I.clickWithWait('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');
    const otpCode2 = await I.extractOtpFromNotifyEmail(accessTokenClientSecret, mfaUserEmail);

    I.fillField('code', otpCode2);
    I.clickWithWait('Continue');
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaturnedOnService1PageSource2 = await I.grabSource();
    const mfaturnedOnService1Code2 = mfaturnedOnService1PageSource2.match(/\?code=([^&]*)(.*)/)[1];
    const mfaturnedOnService1AccessToken2 = await I.getAccessToken(mfaturnedOnService1Code2, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService1JwtDecode2 = await jwt_decode(mfaturnedOnService1AccessToken2);

    assert.equal("access_token", mfaturnedOnService1JwtDecode2.tokenName);
    assert.equal(nonce, mfaturnedOnService1JwtDecode2.nonce);
    assert.equal(1, mfaturnedOnService1JwtDecode2.auth_level);

    I.amOnPage(loginUrl);
    const idamSessionCookie2 = await I.grabCookie('Idam.Session');
    const cookie2 = idamSessionCookie2.value;

    // try authorizing to the mfa turned on service with the Idam session cookie and prompt not login
    const location2 = await I.getWebPublicOidcAuthorize(mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, scope, nonce, cookie2);
    console.log("Location: " + location2);
    expect(location2).to.includes(`${mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl}/?code=`.toLowerCase());

    I.amOnPage(location2);
    I.waitForText(mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const mfaTurnedOnService1PageSource3 = await I.grabSource();
    const mfaTurnedOnService1Code3 = mfaTurnedOnService1PageSource3.match(/\?code=([^&]*)(.*)/)[1];
    const mfaTurnedOnService1AccessToken3 = await I.getAccessToken(mfaTurnedOnService1Code3, mfaTurnedOnService1.clientId, mfaTurnedOnService1.hmctsAccess.postActivationRedirectUrl, serviceClientSecret);

    let mfaturnedOnService1JwtDecode3 = await jwt_decode(mfaTurnedOnService1AccessToken3);

    assert.equal("access_token", mfaturnedOnService1JwtDecode3.tokenName);
    assert.equal(nonce, mfaturnedOnService1JwtDecode3.nonce);
    assert.equal(1, mfaturnedOnService1JwtDecode3.auth_level);

    //Details api
    const userInfo = await I.retry({retries: 3, minTimeout: 10000}).getUserInfo(mfaTurnedOnService1AccessToken3);
    expect(userInfo.active).to.equal(true);
    expect(userInfo.email).to.equal(mfaUserEmail);
    expect(userInfo.forename).to.equal(randomUserFirstName);
    expect(userInfo.id).to.not.equal(null);
    expect(userInfo.surname).to.equal('User');
    expect(userInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(mfaTurnedOnService1AccessToken3);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(mfaUserEmail.toUpperCase());
    expect(oidcUserInfo.uid).to.not.equal(null);
    expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([mfaTurnedOffServiceRole.name, mfaTurnedOnServiceRole.name]);

    expect(oidcUserInfo.name).to.equal(randomUserFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(randomUserFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    I.resetRequestInterception();
}).retry(TestData.SCENARIO_RETRY_LIMIT);