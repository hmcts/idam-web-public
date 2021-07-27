const randomData = require('./shared/random_data');
const TestData = require('./config/test_data');
const assert = require('assert');
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
let orgMFADisabledId;
let orgMFAActiveId;
let professionalUserMFASkipEmail;
let professionalUserMFASkipFirstName;
let professionalUserMFARequiredEmail;
let professionalUserMFARequiredFirstName;
let mfaTurnedOnService;
let mfaApplicationPolicyName;
let professionalRoleName;

BeforeSuite(async ({ I }) => {

    token = await I.getAuthToken();
    mfaTurnedOnServiceName = randomData.getRandomServiceName(testSuiteId);
    mfaTurnedOnService = await I.createNewServiceWithRoles(mfaTurnedOnServiceName, serviceClientSecret,  [], '', token, scope);

    mfaApplicationPolicyName = `MfaByApplicationPolicy-${mfaTurnedOnService.oauth2ClientId}`;
    await I.createPolicyForApplicationMfaTest(mfaApplicationPolicyName, mfaTurnedOnService.activationRedirectUrl, token);

    professionalRoleName = randomData.getRandomRoleName(testSuiteId);
    professionalRole = await I.createRole(professionalRoleName, 'professional description', '', token);

    // Note that @mfaskip.local works with the testing-support mock of the ref data org/mfa endpoint
    professionalUserMFASkipEmail = "professional" + testSuiteId + "@mfaskip.local";
    professionalUserMFASkipFirstName = randomData.getRandomUserName(testSuiteId);
    professionalUserMFASkip = await I.createUserWithRoles(professionalUserMFASkipEmail, userPassword, professionalUserMFASkipFirstName, [professionalRoleName]);

    professionalUserMFARequiredEmail = randomData.getRandomEmailAddress();
    professionalUserMFARequiredFirstName = randomData.getRandomUserName(testSuiteId)
    professionalUserMFARequired = await I.createUserWithRoles(professionalUserMFARequiredEmail, userPassword, professionalUserMFARequiredFirstName, [professionalRoleName]);

    isRefDataEnabled = await I.refDataEnabled()
    if (isRefDataEnabled) {

        // create ref data admin user
        prdAdminUserEmail = randomData.getRandomEmailAddress();
        prdAdminUser = await I.createUserWithRoles(prdAdminUserEmail, userPassword, randomData.getRandomUserName(testSuiteId), ['prd-admin']);
        prdAuthToken = await I.getAccessTokenPasswordGrant(prdAdminUserEmail, userPassword, mfaTurnedOnService.label, mfaTurnedOnService.activationRedirectUrl, serviceClientSecret, scope);

        serviceToken = await I.getServiceAuthToken();
        
        // create organisation with MFA disabled
        let orgMFADisabled = await I.getTestOrganisation(orgMFADisabledCompanyNumber);
        orgMFADisabledDetails = await I.createOrganisation(orgMFADisabled, serviceToken, prdAuthToken)
        orgMFADisabledId = orgMFADisabledDetails.organisationIdentifier;
        await I.updateOrganisation(orgMFADisabledId, orgMFADisabled, serviceToken, prdAuthToken);
        await I.updateOrganisationMFA(orgMFADisabledId, "NONE", serviceToken, prdAuthToken);

        // Add professional user to organisation with MFA disabled
        userAddDetails = await I.addUserToOrganisation(orgMFADisabledId, professionalUserMFASkipEmail, "caseworker", serviceToken, prdAuthToken);
        console.log("Added user to mfa disabled org: " + JSON.stringify(userAddDetails));

        // create organisation with MFA active
        let orgMFAActive = await I.getTestOrganisation(orgMFAActiveCompanyNumber);
        orgMFAActiveDetails = await I.createOrganisation(orgMFAActive, serviceToken, prdAuthToken)
        orgMFAActiveId = orgMFAActiveDetails.organisationIdentifier;
        await I.updateOrganisation(orgMFAActiveId, orgMFAActive, serviceToken, prdAuthToken);
        await I.updateOrganisationMFA(orgMFAActiveId, "EMAIL", serviceToken, prdAuthToken);

        // Add professional user to organisation with MFA disabled
        userAddDetails = await I.addUserToOrganisation(orgMFAActiveId, professionalUserMFARequiredEmail, "caseworker", serviceToken, prdAuthToken);
        console.log("Added user to mfa active org: " + JSON.stringify(userAddDetails));

    } else {
        console.log("ref data integration is disabled");
    }

});

AfterSuite(async ({ I }) => {

    if (orgMFADisabledId) {
        // You cannot delete an organisation with members and there is currently
        // no way to remove users from an organisation, so commenting out the
        // delete until PRD resolve that.
        // await I.deleteOrganisation(orgMFADisabledId, serviceToken, prdAuthToken);
    }
    if (orgMFAActiveId) {
        // You cannot delete an organisation with members and there is currently
        // no way to remove users from an organisation, so commenting out the
        // delete until PRD resolve that.
        // await I.deleteOrganisation(orgMFAActiveId, serviceToken, prdAuthToken);
    }

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

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(0, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    assert.equal(professionalUserMFASkipEmail.toUpperCase(), oidcUserInfo.sub.toUpperCase());
    assert.equal(professionalRoleName, oidcUserInfo.roles[0])
    assert.equal(professionalUserMFASkipFirstName + ' User', oidcUserInfo.name);
    assert.equal(professionalUserMFASkipFirstName, oidcUserInfo.given_name);
    assert.equal('User', oidcUserInfo.family_name);

    if (orgMFADisabledId) {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'caseworker']);
    } else {
        assert.equal(professionalRoleName, oidcUserInfo.roles[0])
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

    assert.equal("access_token", jwtDecode.tokenName);
    assert.equal(nonce, jwtDecode.nonce);
    assert.equal(1, jwtDecode.auth_level);

    //Webpublic OIDC userinfo
    const oidcUserInfo = await I.retry({retries: 3, minTimeout: 10000}).getWebpublicOidcUserInfo(accessToken);
    assert.equal(professionalUserMFARequiredEmail.toUpperCase(), oidcUserInfo.sub.toUpperCase());
    assert.equal(professionalUserMFARequiredFirstName + ' User', oidcUserInfo.name);
    assert.equal(professionalUserMFARequiredFirstName, oidcUserInfo.given_name);
    assert.equal('User', oidcUserInfo.family_name);

    if (orgMFAActiveId) {
        expect(oidcUserInfo.roles).to.deep.equalInAnyOrder([professionalRoleName, 'caseworker']);
    } else {
        assert.equal(professionalRoleName, oidcUserInfo.roles[0])
    }

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);