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

Before(async (I) => {
    randomUserLastName = await I.generateRandomText();
    randomUserFirstName = await I.generateRandomText();
    userEmail = randomUserFirstName + '.' + randomUserLastName + testMailSuffix;
});

After(async (I) => {
return Promise.all([
     I.deleteService(serviceName),
     I.deleteUser(userEmail)
    ]);
});

Scenario('@functional @puiReg PUI Registration Happy Path - No roles', async (I) => {
     await I.createServiceData(serviceName);
     I.wait(5);
     bearerToken = await I.getBearerToken(serviceName, clientSecret, scope, grantType);
     await I.registerUser(bearerToken, userEmail, randomUserFirstName, randomUserLastName);
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
});

Scenario('@functional @puiReg PUI Registration Happy Path - one role', async (I) => {
     var token = await I.getAuthToken();
     await I.createRole(serviceName + "_beta", 'beta description', '', token);

     var serviceRoles = [serviceName + "_beta"];
     await I.createServiceWithRoles(serviceName, serviceRoles, serviceName + "_beta", token);

     I.wait(5);
     bearerToken = await I.getBearerToken(serviceName, clientSecret, scope, grantType);
     await I.registerUserWithRoles(bearerToken, userEmail, randomUserFirstName, randomUserLastName, serviceRoles);
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
});
