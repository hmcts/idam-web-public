module.exports = {
  WEB_PUBLIC_URL: process.env.TEST_URL.replace('https', 'http'),
  IDAM_API: process.env.IDAMAPI,
  SMOKE_TEST_USER_USERNAME: process.env.SMOKE_TEST_USER_USERNAME,
  SMOKE_TEST_USER_PASSWORD: process.env.SMOKE_TEST_USER_PASSWORD,
  NOTIFY_API_KEY: process.env.NOTIFY_API_KEY,
  SCENARIO_RETRY_LIMIT: 3
};