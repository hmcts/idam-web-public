const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('I am able to register user dynamically');

let userEmail;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];
let accessTokenClientSecret;

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    const randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    const randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    const adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    userEmail = 'user.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    let assignableRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_assignable", 'assignable role', '', token);
    let dynamicUserRegRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_dynUsrReg", 'dynamic user reg role', assignableRole.id, token);

    let serviceRoleNames = [assignableRole.name, dynamicUserRegRole.name];
    let serviceRoleIds = [assignableRole.id, dynamicUserRegRole.id];
    roleNames.push(serviceRoleNames);

    await I.createServiceWithRoles(serviceName, serviceClientSecret, serviceRoleIds, '', token, 'create-user');
    serviceNames.push(serviceName);

    I.wait(0.5);

    accessTokenClientSecret = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    await I.createUserUsingTestingSupportService(accessTokenClientSecret, adminEmail, userPassword, randomUserFirstName + 'Admin', [dynamicUserRegRole.name]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, userPassword);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user', base64);
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    await I.registerUserWithRoles(accessToken, userEmail, randomUserFirstName + 'User', randomUserLastName, assignableRole.name);
    userFirstNames.push(randomUserFirstName + 'User');
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional  Register User Dynamically', async ({ I }) => {
    let url = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, userEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    await I.runAccessibilityTest();
    I.waitForText('Create a password');
    I.fillField('#password1', userPassword);
    I.fillField('#password2', userPassword);
    I.click('Continue');
    I.waitForText('Account created');
    I.see('You can now sign in to your account.');
    await I.runAccessibilityTest();
});