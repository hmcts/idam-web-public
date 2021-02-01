const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');
const browser = process.env.SAUCE_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const waitForTimeout = 60000;
const smartWait = 5000;

const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  tags: ['idam-web-public']
};

const getBrowserConfig = browserGroup => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            console.log("Setting up " + browserGroup)
            const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
            candidateCapabilities['sauce:options'] = merge(defaultSauceOptions, candidateCapabilities['sauce:options']);
            browserConfig.push({
                browser: candidateCapabilities.browserName,
                capabilities: candidateCapabilities
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

const setupConfig = {
    tests: './src/test/js/cross_browser_test.js',
    output: `${process.cwd()}/functional-output`,
    helpers: {
        WebDriver: {
            url: process.env.TEST_URL,
            browser: 'chrome',
            waitForTimeout,
            smartWait,
            cssSelectorsEnabled: 'true',
            host: 'ondemand.eu-central-1.saucelabs.com',
            port: 80,
            region: 'eu',
            capabilities: {}

        },
        SauceLabsReportingHelper: {require: './src/test/js/shared/sauceLabsReportingHelper.js'},
        idam_helper: {require: './src/test/js/shared/idam_helper.js'}
    },
    include: {I: './src/test/js/shared/custom_steps.js'},

    multiple: {
        microsoft: {
            browsers: getBrowserConfig('microsoft')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        }
    },
    name: 'Idam web public'
};

exports.config = setupConfig;