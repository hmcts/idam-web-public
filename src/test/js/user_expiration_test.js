const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('User Management Test');

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
    let token1 =  await I.fetchToken();

    let token = await I.getAuthToken();
    await I.createRole1(randomData.getRandomRoleName(testSuitePrefix) + "_assignable", 'assignable role', '', token1);
    // let assignableRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_assignable", 'assignable role', '', token);
    // let dynamicUserRegRole = await I.createRole(randomData.getRandomRoleName(testSuitePrefix) + "_dynUsrReg", 'dynamic user reg role', assignableRole.id, token);
    //
    // let serviceRoleNames = [assignableRole.name, dynamicUserRegRole.name];
    // let serviceRoleIds = [assignableRole.id, dynamicUserRegRole.id];
    // roleNames.push(serviceRoleNames);
    // let scopes = ["create-user" ];
    //  await I.createServiceWithRoles1(serviceName, serviceClientSecret, serviceRoleNames, '', token1, scopes);
    //
    // serviceNames.push(serviceName);
    //
    // I.wait(0.5);
    //
    // accessTokenClientSecret = await I.getAccessTokenClientSecret(serviceName, serviceClientSecret);
    // await I.createUserUsingTestingSupportService(token1, adminEmail, userPassword, randomUserFirstName + 'Admin', [dynamicUserRegRole.name]);
    // userFirstNames.push(randomUserFirstName + 'Admin');
    //
    // const base64 = await I.getBase64(adminEmail, userPassword);
    // const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user', base64);
    // const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);
    //
    // await I.registerUserWithRoles(accessToken, userEmail, randomUserFirstName + 'User', randomUserLastName, assignableRole.name);
    // userFirstNames.push(randomUserFirstName + 'User');
    // await I.expireUser(userEmail)
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional123  @test  User registration link expiration', async ({ I }) => {
    if(1==1) return;
    let url = await I.extractUrlFromNotifyEmail(accessTokenClientSecret, userEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    await I.runAccessibilityTest();
    I.waitForText('Your link has expired, or has already been used');
});