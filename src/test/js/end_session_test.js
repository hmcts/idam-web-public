const TestData = require('./config/test_data');
const randomData = require('./shared/random_data');

Feature('Users can end session');

let randomUserFirstName;
let citizenEmail;
let serviceNames = [];
let userFirstNames = [];

const testSuitePrefix = randomData.getRandomAlphabeticString();
const serviceName =  randomData.getRandomServiceName(testSuitePrefix);
const serviceClientSecret = randomData.getRandomClientSecret();
const userPassword = randomData.getRandomUserPassword();

BeforeSuite(async ({ I }) => {
    randomUserFirstName = randomData.getRandomUserName(testSuitePrefix);
    citizenEmail = 'citizen.' + randomData.getRandomEmailAddress();

    const token = await I.getAuthToken();
    await I.createService(serviceName, serviceClientSecret, '', token, 'openid profile roles', []);
    serviceNames.push(serviceName);

    I.wait(0.5);

    await I.createUserWithRoles(citizenEmail, userPassword, randomUserFirstName + 'Citizen', ["citizen"]);
    userFirstNames.push(randomUserFirstName + 'Citizen');
});

AfterSuite(async ({ I }) => {
    return await I.deleteAllTestData(randomData.TEST_BASE_PREFIX + testSuitePrefix);
});

Scenario('@functional @endSession End Session', async ({ I }) => {
    let authorizeQueryParams = `client_id=${serviceName}&redirect_uri=${TestData.SERVICE_REDIRECT_URI}&response_type=code&scope=openid profile roles`;
    let authorizeEndpointUrl = TestData.WEB_PUBLIC_URL + `/o/authorize?${authorizeQueryParams}`;

    I.amOnPage(authorizeEndpointUrl);
    const [page] = await I.getCurrentPage()
    if (!page.url().includes(TestData.WEB_PUBLIC_URL)) {
        // then idam-api is configured to redirect to a different idam-web-public on authorize request
        // so we will go direct to the login page and create a session from there
        let loginUrl = TestData.WEB_PUBLIC_URL + `/login?${authorizeQueryParams}`;
        I.amOnPage(loginUrl);
    }

    I.waitForText('Sign in');
    I.fillField('#username', citizenEmail);
    I.fillField('#password', userPassword);
    I.interceptRequestsAfterSignin();
    I.click('Sign in');

    I.waitInUrl(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    I.amOnPage(authorizeEndpointUrl);
    I.dontSee('Sign in');
    I.waitInUrl(TestData.SERVICE_REDIRECT_URI);
    I.see('code=');
    I.dontSee('error=');

    I.amOnPage(TestData.WEB_PUBLIC_URL + `/o/endSession?post_logout_redirect_uri=${TestData.SERVICE_REDIRECT_URI}`);
    I.waitInUrl(TestData.SERVICE_REDIRECT_URI);
    I.dontSee('code=');

    I.amOnPage(authorizeEndpointUrl);
    if (!page.url().includes(TestData.WEB_PUBLIC_URL)) {
        // then idam-api is configured to redirect to a different idam-web-public on authorize request
        // so we will go direct to the login page and create a session from there
        let loginUrl = TestData.WEB_PUBLIC_URL + `/login?${authorizeQueryParams}`;
        I.amOnPage(loginUrl);
    }
    I.waitForText('Sign in');

    I.resetRequestInterception();

}).retry(TestData.SCENARIO_RETRY_LIMIT);