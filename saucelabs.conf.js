const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');
const browser = process.env.SAUCELABS_BROWSER || "chrome_mac_latest";
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';
const setupConfig = {
    'tests': "./src/test/js/login_user_test.js",
    'output': './output',
    'timeout': 60000,
    "helpers": {
        "WebDriverIO": {
            "url": process.env.TEST_URL,
            "browser": supportedBrowsers[browser].browserName,
            "cssSelectorsEnabled": "true",
            "ignore-certificate-errors": "true",
            "host": "ondemand.saucelabs.com",
            "port": 80,
            "user": process.env.SAUCE_USERNAME,
            "key": process.env.SAUCE_ACCESS_KEY,
            "desiredCapabilities" : getDesiredCapabilities(),
        },
        "idam_helper": {
            'require': './src/test/js/shared/idam_helper.js'
        },
    },
    'include': {
        'I': './src/test/js/shared/custom_steps.js'
    },
    'mocha': {
        'reporterOptions': {
            'reportDir': './output',
            'reportName' : browser + '_report',
            'reportTitle': 'Crossbrowser results for: ' + browser.toUpperCase(),
            'inlineAssets': true
        }
    },
    'name': 'idam-ui-tests'
};
function getDesiredCapabilities() {
    let desiredCapability = supportedBrowsers[browser];
    desiredCapability.tunnelIdentifier = tunnelName;
    desiredCapability.acceptSslCerts = true;
    return desiredCapability;
}
 exports.config = setupConfig;