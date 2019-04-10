var TestData = require('./config/test_data');

Feature('I am able to register user dynamically');

let adminEmail;
let randomUserFirstName;
let randomUserLastName;
let userEmail;
let accessToken;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    adminEmail = 'admin.' + randomUserLastName + testMailSuffix;
    userEmail = 'user.' + randomUserLastName + testMailSuffix;

    var token = await I.getAuthToken();
    await I.createRole(serviceName + "_assignable", 'assignable role', '', token);
    await I.createRole(serviceName + "_dynUsrReg", 'dynamic user reg role', serviceName + "_assignable", token);

    var serviceRoles = [serviceName + "_dynUsrReg", serviceName + "_assignable"];
    await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token, 'create-user');
    await I.createUserWithRoles(adminEmail, 'Admin', [serviceName + "_dynUsrReg"]);

    var base64 = await I.getBase64(adminEmail, password);
    var code = await I.getAuthorizeCode(serviceName, redirectUri, 'create-user', base64);
    var accessToken = await I.getAccessToken(code, serviceName, redirectUri, clientSecret);

    await I.registerUserWithRoles(accessToken, userEmail, randomUserFirstName, randomUserLastName, serviceName + "_assignable")
});

AfterSuite(async (I) => {
return Promise.all([
    I.deleteUser(userEmail),
    I.deleteService(serviceName),
    I.deleteUser(adminEmail)
    ]);
});

Scenario('@functional Register User Dynamically', async (I) => {
    I.wait(10);

    var url = await I.extractUrl(userEmail);
    if (url) {
        url = url.replace('https://idam-web-public.aat.platform.hmcts.net', TestData.WEB_PUBLIC_URL);
    }
    I.amOnPage(url);
    I.waitForText('Create a password', 20, 'h1');
    I.fillField('#password1', password);
    I.fillField('#password2', password);
    I.click('Continue');
    I.waitForText('Account created', 60, 'h1');
    I.see('You can now sign in to your account.');
}).retry(TestData.SCENARIO_RETRY_LIMIT);