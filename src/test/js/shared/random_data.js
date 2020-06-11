function randomString(length = 10) {
    return Math.random().toString(36).substr(2, length);
}

function randomAlphabeticString(length = 10) {
    let randomString = '';
    let randomAscii;
    for(let i = 0; i < length; i++) {
        randomAscii = Math.floor((Math.random() * 25) + 97);
        randomString += String.fromCharCode(randomAscii)
    }
    return randomString
}

const testBasePrefix = "SIDMTESTWP_" + randomAlphabeticString();
const testUserPrefix = testBasePrefix + "USER";
const testRolePrefix = testBasePrefix + "ROLE_";
const testServicePrefix = testBasePrefix + "SERVICE_";

module.exports = {
    getRandomString: randomString,
    TEST_BASE_PREFIX: testBasePrefix,
    TEST_USER_PREFIX: testUserPrefix,
    TEST_ROLE_PREFIX: testRolePrefix,
    TEST_SERVICE_PREFIX: testServicePrefix,
    getRandomUserName: () => testUserPrefix + randomAlphabeticString(),
    getRandomRoleName: () => testRolePrefix + randomString(),
    getRandomServiceName: () => testServicePrefix + randomString(),
    getRandomEmailAddress: () => randomString() + "@mailtest.gov.uk",
};