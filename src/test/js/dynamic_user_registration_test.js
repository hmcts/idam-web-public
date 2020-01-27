const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('I am able to register user dynamically');

let userEmail;
let userFirstNames = [];
let roleNames = [];
let serviceNames = [];

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async (I) => {
    const randomUserLastName = randomData.getRandomUserName();
    const randomUserFirstName = randomData.getRandomUserName();
    const adminEmail = 'admin.' + randomData.getRandomEmailAddress();
    userEmail = 'user.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    let response;
    response = await I.createRole(randomData.getRandomRoleName() + "_assignable", 'assignable role', '', token);
    const assignableRole = response.name;
    response = await I.createRole(randomData.getRandomRoleName() + "_dynUsrReg", 'dynamic user reg role', assignableRole, token);
    const dynamicUserRegRole = response.name;
    const serviceRoles = [dynamicUserRegRole, assignableRole];
    roleNames.push(serviceRoles);
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token, 'create-user');
    serviceNames.push(serviceName);
    await I.createUserWithRoles(adminEmail, randomUserFirstName + 'Admin', [dynamicUserRegRole]);
    userFirstNames.push(randomUserFirstName + 'Admin');

    const base64 = await I.getBase64(adminEmail, TestData.PASSWORD);
    const code = await I.getAuthorizeCode(serviceName, TestData.SERVICE_REDIRECT_URI, 'create-user', base64);
    const accessToken = await I.getAccessToken(code, serviceName, TestData.SERVICE_REDIRECT_URI, TestData.SERVICE_CLIENT_SECRET);

    await I.registerUserWithRoles(accessToken, userEmail, randomUserFirstName + 'User', randomUserLastName, assignableRole)
    userFirstNames.push(randomUserFirstName + 'User');
});

AfterSuite(async (I) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@functional Register User Dynamically', async (I) => {
    I.wait(5);

    let url = await I.extractUrl(userEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', TestData.PASSWORD);
    I.fillField('#password2', TestData.PASSWORD);
    I.click('Continue');
    I.waitForText('Account created', 20, 'h1');
    I.see('You can now sign in to your account.');
});