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

function generatePassword(passwordLength) {
    const numberChars = "0123456789";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    let allChars = numberChars + upperChars + lowerChars;
    let randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray = randPasswordArray.fill(allChars, 3);
    return shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const testBasePrefix = "SIDMTESTWP_" + randomAlphabeticString();

module.exports = {
    getRandomString: randomString,
    getRandomAlphabeticString: randomAlphabeticString,
    TEST_BASE_PREFIX: testBasePrefix,
    getRandomEmailAddress: () => randomString() + "@mailtest.gov.uk",
    getRandomUserPassword: () => generatePassword(12),
    getRandomClientSecret: () => generatePassword(12),
    getRandomUserName: (testSuitePrefix) => testBasePrefix + testSuitePrefix + "USER" + randomAlphabeticString(),
    getRandomRoleName: (testSuitePrefix) => testBasePrefix + testSuitePrefix + "ROLE_" + randomString(),
    getRandomServiceName: (testSuitePrefix) => testBasePrefix + testSuitePrefix + "SERVICE_" + randomString(),
};