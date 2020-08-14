module.exports = {
    WEB_PUBLIC_URL: process.env.TEST_URL,
    IDAM_API: process.env.IDAMAPI,
    SMOKE_TEST_USER_USERNAME: process.env.SMOKE_TEST_USER_USERNAME,
    SMOKE_TEST_USER_PASSWORD: process.env.SMOKE_TEST_USER_PASSWORD,
    NOTIFY_API_KEY: process.env.NOTIFY_API_KEY,
    SCENARIO_RETRY_LIMIT: 3,
    PASSWORD: "Passw0rdIDAM",
    SERVICE_REDIRECT_URI: 'http://idam.testservice.gov.uk',
    SERVICE_CLIENT_SECRET: 'autotestingservice',
    EJUDICIARY_SSO_PROVIDER_KEY: 'ejudiciary-aad',
    //TODO: Update test username after it's set up in aad
    EJUDICIARY_TEST_USER_USERNAME: '',
    EJUDICIARY_TEST_USER_PASSWORD: process.env.EJUDICIARY_TEST_USER_PASSWORD
};