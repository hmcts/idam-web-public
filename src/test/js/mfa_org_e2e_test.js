const randomData = require('./shared/random_data');
const TestData = require('./config/test_data');
const jwt_decode = require('jwt-decode');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const {expect} = chai;

Feature('I am able to login with MFA for my organisation');

const scope = "openid profile roles manage-user create-user";
const nonce = "0km9sBrZfnXv8e_O7U-XmSR6vtIgtUVTGybVUdoLV7g";
const state = "44p4OfI5CXbdvMTpRYWfleNWIYm6qz0qNDgMOm2qgpU";
const testSuiteId = randomData.getRandomAlphabeticString();
const userPassword = randomData.getRandomUserPassword();
const serviceClientSecret = randomData.getRandomClientSecret();
const orgMFADisabledCompanyNumber = randomData.getRandomAlphabeticString(7);
const orgMFAActiveCompanyNumber = randomData.getRandomAlphabeticString(7);
let token;
let serviceToken;
let prdAuthToken;
let isRefDataEnabled;
let professionalUserMFASkipEmail;
let professionalUserMFASkipFirstName;
let professionalUserMFADisabledEmail;
let professionalUserMFADisabledFirstName;
let professionalUserMFARequiredEmail;
let professionalUserMFARequiredFirstName;
let mfaTurnedOnService;
let mfaApplicationPolicyName;
let professionalRoleName;

BeforeSuite(async ({ I }) => {

    token = await I.getAuthToken();
    const mfaTurnedOnServiceName = randomData.getRandomServiceName(testSuiteId);
    mfaTurnedOnService = await I.createNewServiceWithRoles(mfaTurnedOnServiceName, serviceClientSecret,  [], '', token, scope);

    mfaApplicationPolicyName = `MfaByApplicationPolicy-${mfaTurnedOnService.oauth2ClientId}`;
    await I.createPolicyForApplicationMfaTest(mfaApplicationPolicyName, mfaTurnedOnService.activationRedirectUrl, token);

    I.wait(0.5);

    professionalRoleName = randomData.getRandomRoleName(testSuiteId);
    await I.createRole(professionalRoleName, 'professional description', '', token);

    isRefDataEnabled = await I.refDataEnabled();
    if (isRefDataEnabled) {
        professionalUserMFASkipEmail = "freg-test-user-idamskipmfa" + testSuiteId + "@prdfunctestuser.com";
        professionalUserMFADisabledEmail = "freg-test-user-idammfadisabled" + testSuiteId + "@prdfunctestuser.com";
        professionalUserMFARequiredEmail = "freg-test-user-idamrequiremfa" + testSuiteId + "@prdfunctestuser.com";
    } else {
        // Note that @mfaskip.local works with the testing-support mock of the ref data org/mfa endpoint
        professionalUserMFASkipEmail = "professional" + testSuiteId + "@mfaskip.local";
        professionalUserMFADisabledEmail = randomData.getRandomEmailAddress();
        professionalUserMFARequiredEmail = randomData.getRandomEmailAddress();
    }

    const accessToken = await I.getAccessTokenClientSecret(mfaTurnedOnServiceName, serviceClientSecret);

    professionalUserMFASkipFirstName = randomData.getRandomUserName(testSuiteId);
    await I.createUserUsingTestingSupportService(accessToken, professionalUserMFASkipEmail, userPassword, professionalUserMFASkipFirstName, [professionalRoleName]);

    professionalUserMFADisabledFirstName = randomData.getRandomUserName(testSuiteId);
    await I.createUserUsingTestingSupportService(accessToken, professionalUserMFADisabledEmail, userPassword, professionalUserMFADisabledFirstName, [professionalRoleName, 'idam-mfa-disabled']);

    professionalUserMFARequiredFirstName = randomData.getRandomUserName(testSuiteId);
    await I.createUserUsingTestingSupportService(accessToken, professionalUserMFARequiredEmail, userPassword, professionalUserMFARequiredFirstName, [professionalRoleName]);

    if (isRefDataEnabled) {

        // create ref data admin user
        const prdAdminUserEmail = randomData.getRandomEmailAddress();
        await I.createUserUsingTestingSupportService(accessToken, prdAdminUserEmail, userPassword, randomData.getRandomUserName(testSuiteId), ['prd-admin']);
        prdAuthToken = await I.getAccessTokenPasswordGrant(prdAdminUserEmail, userPassword, mfaTurnedOnService.label, mfaTurnedOnService.activationRedirectUrl, serviceClientSecret, scope);

        serviceToken = await I.getServiceAuthToken();

        // create organisation with MFA disabled
        let orgMFADisabled = await I.getTestOrganisation(orgMFADisabledCompanyNumber);
        let orgMFADisabledDetails = await I.createOrganisation(orgMFADisabled, serviceToken, prdAuthToken);
        const orgMFADisabledId = orgMFADisabledDetails.organisationIdentifier;
        await I.updateOrganisation(orgMFADisabledId, orgMFADisabled, serviceToken, prdAuthToken);
        await I.updateOrganisationMFA(orgMFADisabledId, "NONE", serviceToken, prdAuthToken);

        // Add professional user to organisation with MFA disabled
        let userAddDetails = await I.addUserToOrganisation(orgMFADisabledId, professionalUserMFASkipEmail, "caseworker", serviceToken, prdAuthToken);
        console.log("Added user to mfa disabled org: " + JSON.stringify(userAddDetails));

        // create organisation with MFA active
        let orgMFAActive = await I.getTestOrganisation(orgMFAActiveCompanyNumber);
        let orgMFAActiveDetails = await I.createOrganisation(orgMFAActive, serviceToken, prdAuthToken);
        const orgMFAActiveId = orgMFAActiveDetails.organisationIdentifier;
        await I.updateOrganisation(orgMFAActiveId, orgMFAActive, serviceToken, prdAuthToken);
        await I.updateOrganisationMFA(orgMFAActiveId, "EMAIL", serviceToken, prdAuthToken);

        // Add professional user to organisation with MFA enabled
        userAddDetails = await I.addUserToOrganisation(orgMFAActiveId, professionalUserMFARequiredEmail, "caseworker", serviceToken, prdAuthToken);
        console.log("Added user to mfa active org: " + JSON.stringify(userAddDetails));

        // Add idam-mfa-disabled role professional user to organisation with MFA enabled
        userAddDetails = await I.addUserToOrganisation(orgMFAActiveId, professionalUserMFADisabledEmail, "caseworker", serviceToken, prdAuthToken);
        console.log("Added mfa disabled user to mfa active org: " + JSON.stringify(userAddDetails));
    } else {
        console.log("ref data integration is disabled");
    }

});

AfterSuite(async ({ I }) => {
    return Promise.all([
        I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuiteId),
        I.deletePolicy(mfaApplicationPolicyName, token),
    ]);
});

Scenario('@functional @mfaOrgLogin I am able to login without MFA as a member of an organisation that has MFA disabled', async ({ I }) => {

    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=${state}&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', professionalUserMFASkipEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, serviceClientSecret);

    let jwtDecode = await jwt_decode(accessToken);

    expect(jwtDecode.tokenName).to.equal("access_token");
    expect(jwtDecode.nonce).to.equal(nonce);
    expect(jwtDecode.auth_level).to.equal(0);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(professionalUserMFASkipEmail.toUpperCase());
    expect(oidcUserInfo.name).to.equal(professionalUserMFASkipFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(professionalUserMFASkipFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    if (isRefDataEnabled) {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'caseworker']);
    } else {
        expect(oidcUserInfo.roles[0]).to.equal(professionalRoleName);
    }

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaOrgLogin I am able to login with MFA as a member of an organisation that has MFA active', async ({ I }) => {

    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=${state}&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', professionalUserMFARequiredEmail);
    I.fillField('#password', userPassword);
    I.click('Sign in');
    I.seeInCurrentUrl("/verification");
    I.waitForText('Verification required');

    const otpCode = await I.extractOtpFromNotifyEmail(professionalUserMFARequiredEmail);

    I.fillField('code', otpCode);
    I.interceptRequestsAfterSignin();
    I.click('Continue');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, serviceClientSecret);

    let jwtDecode = await jwt_decode(accessToken);

    expect(jwtDecode.tokenName).to.equal("access_token");
    expect(jwtDecode.nonce).to.equal(nonce);
    expect(jwtDecode.auth_level).to.equal(1);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(professionalUserMFARequiredEmail.toUpperCase());
    expect(oidcUserInfo.name).to.equal(professionalUserMFARequiredFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(professionalUserMFARequiredFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    if (isRefDataEnabled) {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'caseworker']);
    } else {
        expect(oidcUserInfo.roles[0]).to.equal(professionalRoleName);
    }

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@functional @mfaOrgLogin am able to login without MFA as an idam-mfa-disabled role user but a member of an organisation that has MFA active', async ({ I }) => {

    const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${mfaTurnedOnService.activationRedirectUrl}&client_id=${mfaTurnedOnService.oauth2ClientId}&state=${state}&nonce=${nonce}&response_type=code&scope=${scope}&prompt=`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in');
    I.fillField('#username', professionalUserMFADisabledEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    I.waitForText(mfaTurnedOnService.activationRedirectUrl.toLowerCase());
    I.see('code=');
    I.dontSee('error=');

    const pageSource = await I.grabSource();
    const code = pageSource.match(/\?code=([^&]*)(.*)/)[1];
    const accessToken = await I.getAccessToken(code, mfaTurnedOnService.oauth2ClientId, mfaTurnedOnService.activationRedirectUrl, serviceClientSecret);

    let jwtDecode = await jwt_decode(accessToken);

    expect(jwtDecode.tokenName).to.equal("access_token");
    expect(jwtDecode.nonce).to.equal(nonce);
    expect(jwtDecode.auth_level).to.equal(0);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    expect(oidcUserInfo.sub.toUpperCase()).to.equal(professionalUserMFADisabledEmail.toUpperCase());
    expect(oidcUserInfo.name).to.equal(professionalUserMFADisabledFirstName + ' User');
    expect(oidcUserInfo.given_name).to.equal(professionalUserMFADisabledFirstName);
    expect(oidcUserInfo.family_name).to.equal('User');

    if (isRefDataEnabled) {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'idam-mfa-disabled', 'caseworker']);
    } else {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'idam-mfa-disabled']);
    }

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);