const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('User Management Test');

let userEmail;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];
let testingToken;

const testSuitePrefix = "uetest" + randomData.getRandomAlphabeticString();
const serviceName = randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    const randomUserLastName = randomData.getRandomUserName(testSuitePrefix);
    const randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    const adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    userEmail = 'user.' + randomData.getRandomEmailAddress();

    testingToken= await I.getToken();
    let assignableRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_assignable", 'assignable role', [], testingToken);
    let dynamicUserRegRole = await I.createRoleUsingTestingSupportService(randomData.getRandomRoleName(testSuitePrefix) + "_dynUsrReg", 'dynamic user reg role', [assignableRole.name], testingToken);

    let serviceRoleNames = [assignableRole.name, dynamicUserRegRole.name];
    roleNames.push(serviceRoleNames);
    await I.createServiceUsingTestingSupportService(serviceName, serviceClientSecret,[serviceRoleNames], testingToken, ["openid", "profile", "roles", "manage-user", "create-user"],[]);

    serviceNames.push(serviceName);

    I.wait(0.5);

    await I.createUserUsingTestingSupportService(testingToken, adminEmail, userPassword, randomUserFirstName + 'Admin', [dynamicUserRegRole.name]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, userPassword);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user', base64);
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, serviceClientSecret);

    await I.registerUserWithRoles(accessToken, userEmail, randomUserFirstName + 'User', randomUserLastName, assignableRole.name);
    userFirstNames.push(randomUserFirstName + 'User');
    await I.expireUser(userEmail)
});


Scenario('@functional @userexpiration User registration link expiration', async ({ I }) => {
    let url = await I.extractUrlFromNotifyEmail(testingToken, userEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    await I.runAccessibilityTest();
    I.waitForText('Your link has expired, or has already been used');
});