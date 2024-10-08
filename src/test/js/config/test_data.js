module.exports = {
    WEB_PUBLIC_URL: process.env.TEST_URL,
    IDAM_API: process.env.IDAMAPI,
    IDAM_TESTING_SUPPORT_API: process.env.TESTING_SUPPORT_API_URL,
    SMOKE_TEST_USER_USERNAME: process.env.SMOKE_TEST_USER_USERNAME,
    SMOKE_TEST_USER_PASSWORD: process.env.SMOKE_TEST_USER_PASSWORD,
    NOTIFY_API_KEY: process.env.NOTIFY_API_KEY,
    SCENARIO_RETRY_LIMIT: 3,
    WAIT_FOR_ACTION_TIMEOUT: process.env.WAIT_FOR_ACTION_TIMEOUT || 2700,
    SERVICE_REDIRECT_URI: 'https://idam.testservice.gov.uk',
    EJUDICIARY_SSO_PROVIDER_KEY: 'ejudiciary-aad',
    EJUDICIARY_TEST_USER_USERNAME: 'SIDM_EJUD_TEST_A@ejudiciary.net',
    EJUDICIARY_TEST_USER_PASSWORD: process.env.EJUDICIARY_TEST_USER_PASSWORD,
    MOJ_SSO_PROVIDER_KEY: 'moj',
    MOJ_TEST_USER_USERNAME: 'sso_justice_test_user@testjusticeuk.onmicrosoft.com',
    MOJ_TEST_USER_SSO_ID: 'baa672b9-a5f3-4606-8aa5-9e60444a3b31',
    MOJ_TEST_USER_PASSWORD: process.env.MOJ_TEST_USER_PASSWORD,
    TestOutputDir: process.env.E2E_OUTPUT_DIR || './output',
    TestForAccessibility: process.env.TESTS_FOR_ACCESSIBILITY === 'true',
    RPE_AUTH_URL: process.env.RPE_AUTH_URL,
    FUNCTIONAL_TEST_SERVICE_CLIENT_SECRET: process.env.FUNCTIONAL_TEST_SERVICE_CLIENT_SECRET,
    FUNCTIONAL_TEST_TOKEN:'',
    REF_DATA_URL: process.env.REF_DATA_URL
};