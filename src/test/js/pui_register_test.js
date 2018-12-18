var TestData = require('./config/test_data');

Feature('PUI Self Register');

let randomUserFirstName;
let randomUserLastName;
let userEmail;
let bearerToken;

const serviceName = 'TEST_SERVICE_' + Date.now();
const testMailSuffix = '@mailtest.gov.uk';
const password = "Passw0rdIDAM"
const redirectUri = 'https://idam.testservice.gov.uk';
const clientSecret = 'autotestingservice';
const scope = 'create-user';
const grantType = 'client_credentials';

BeforeSuite(async (I) => {
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();

    userEmail = randomUserFirstName + '.' + randomUserLastName + testMailSuffix;

    await I.createServiceData(serviceName);

//    bearerToken = await I.getBearerToken(serviceName, clientSecret, scope, grantType);
    bearerToken = await I.getBearerToken('TEST_SERVICE_1545092748539', 'autotestingservice', 'create-user', 'client_credentials');
    await I.registerUser(bearerToken, userEmail, randomUserFirstName, randomUserLastName);
});

//AfterSuite(async (I) => {
//return Promise.all([
//     I.deleteService(serviceName),
//     I.deleteUser(userEmail)
//    ]);
//});

 Scenario('@functional @puiReg PUI Registration', async (I) => {
//     I.amOnPage(TestData.WEB_PUBLIC_URL + '/login/uplift?client_id=' + serviceName + '&redirect_uri=' + redirectUri + '&jwt=' + accessToken);
//     I.waitForText('Create an account or sign in', 30, 'h1');
//     I.fillField('#firstName', randomUserFirstName);
//     I.fillField('#lastName', randomUserLastName);
//     I.fillField('#username', citizenEmail);
//     I.scrollPageToBottom();
//     I.click('Continue');
//     I.waitForText('Check your email', 20, 'h1');
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
 });
 // NOTE: Retrying this scenario is problematic.