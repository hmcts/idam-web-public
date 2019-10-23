function randomString(length = 10) {
  return Math.random().toString(36).substr(2, length);
}

const testBasePrefix = "SIDM_TEST_" + randomString() + "_";
const testUserPrefix = testBasePrefix + "USER_";
const testRolePrefix = testBasePrefix + "ROLE_";
const testServicePrefix = testBasePrefix + "SERVICE_";

module.exports = {
  getRandomString: randomString,
  TEST_BASE_PREFIX: testBasePrefix,
  TEST_USER_PREFIX: testUserPrefix,
  TEST_ROLE_PREFIX: testRolePrefix,
  TEST_SERVICE_PREFIX: testServicePrefix,
  getRandomUserName: () => testUserPrefix + randomString(),
  getRandomRoleName: () => testRolePrefix + randomString(),
  getRandomServiceName: () => testServicePrefix + randomString(),
  getRandomEmailAddress: () => randomString() + "@mailtest.gov.uk",
};