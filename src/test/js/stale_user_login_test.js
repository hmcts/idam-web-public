const testData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Stale user login');

let randomUserFirstName;
let citizenEmail;

const serviceName = randomData.getRandomServiceName();

BeforeSuite(async(I) => {

    randomUserFirstName = randomData.getRandomUserName();
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    await I.createService(serviceName, '', token, '');
    await I.createUserWithRoles(citizenEmail, randomUserFirstName + 'Citizen', ["citizen"]);
    await I.retireStaleUser(citizenEmail);
});

AfterSuite(async(I) => {
    I.deleteAllTestData(randomData.TEST_BASE_PREFIX);
});

Scenario('@feature @staleUserLogin Stale user login', async(I) => {
    const loginUrl = `${testData.WEB_PUBLIC_URL}/login?redirect_uri=${testData.SERVICE_REDIRECT_URI}&client_id=${serviceName}`;

    I.amOnPage(loginUrl);
    I.waitForText('Sign in', 20, 'h1');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', testData.PASSWORD);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');
    //TODO: code not deployed yet
    //I.waitForText('There is a problem with your account login details', 20, 'h1');
});