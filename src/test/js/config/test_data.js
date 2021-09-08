module.exports = {
    WEB_PUBLIC_URL: process.env.TEST_URL,
    IDAM_API: process.env.IDAMAPI,
    SMOKE_TEST_USER_USERNAME: process.env.SMOKE_TEST_USER_USERNAME,
    SMOKE_TEST_USER_PASSWORD: process.env.SMOKE_TEST_USER_PASSWORD,
    NOTIFY_API_KEY: process.env.NOTIFY_API_KEY,
    SCENARIO_RETRY_LIMIT: 3,
    SERVICE_REDIRECT_URI: 'https://idam.testservice.gov.uk',
    EJUDICIARY_SSO_PROVIDER_KEY: 'ejudiciary-aad',
    EJUDICIARY_TEST_USER_USERNAME: 'SIDM_EJUD_TEST_A@ejudiciary.net',
    EJUDICIARY_TEST_USER_PASSWORD: process.env.EJUDICIARY_TEST_USER_PASSWORD,
    MOJ_SSO_PROVIDER_KEY: 'moj',
    MOJ_TEST_USER_USERNAME: 'sso_justice_test_user@testjusticeuk.onmicrosoft.com',
    MOJ_TEST_USER_PASSWORD: process.env.MOJ_TEST_USER_PASSWORD,
    TestOutputDir: process.env.E2E_OUTPUT_DIR || './output',
    TestForAccessibility: process.env.TESTS_FOR_ACCESSIBILITY === 'true',
    RPE_AUTH_URL: process.env.RPE_AUTH_URL,
    REF_DATA_URL: process.env.REF_DATA_URL
};