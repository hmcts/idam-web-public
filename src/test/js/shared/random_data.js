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

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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

function getBuildIdentifier(defaultValue = 'test', delimiter = '.') {
    const { BRANCH_NAME, BUILD_NUMBER } = process.env;

    let branch = BRANCH_NAME ? BRANCH_NAME.toLowerCase().replace(/[^a-z0-9]/g, '') : defaultValue;
    const build = BUILD_NUMBER ? BUILD_NUMBER : 'local';

    if (!BRANCH_NAME && !BUILD_NUMBER) {
      return defaultValue;
    }

    return `${branch}${delimiter}${build}`;
}

function getBranchIdentifier(defaultValue = 'test') {
    const { BRANCH_NAME } = process.env;

    let branch = BRANCH_NAME ? BRANCH_NAME.toLowerCase().replace(/[^a-z]/g, '') : defaultValue;

    if (!BRANCH_NAME) {
      return defaultValue;
    }

    return `${branch}`;
}
const testBasePrefix = "iwp_" ;

module.exports = {
    getRandomString: randomString,
    getRandomAlphabeticString: randomAlphabeticString,
    TEST_BASE_PREFIX: testBasePrefix,
    getRandomEmailAddress: () => randomString() + "@" + getBuildIdentifier() + ".local",
    getRandomUserPassword: () => generatePassword(12),
    getRandomClientSecret: () => generatePassword(12),
    getRandomTextFor11KB: () => createRandomString(1112150),
    getRandomUserName: (testSuitePrefix) => testBasePrefix + "USER_" + testSuitePrefix + "_" + randomAlphabeticString(),
    getRandomRoleName: (testSuitePrefix) => testBasePrefix + "ROLE_" + testSuitePrefix + "_" + getBuildIdentifier("ROLE", "_") + "_" + randomString(),
    getRandomServiceName: (testSuitePrefix) => testBasePrefix +  "SERVICE_" + testSuitePrefix + "_" + getBuildIdentifier("SVC", "_") + "_" + randomString(),
};