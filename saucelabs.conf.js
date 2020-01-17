const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');
const browser = process.env.SAUCELABS_BROWSER || "ie9_win7";
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';
const setupConfig = {
    'tests': "./src/test/js/*.js",
    'output': './output',
    'timeout': 60000,
    "helpers": {
        "WebDriverIO": {
                    "url": process.env.TEST_URL,
                    "browser": "ie9_win7",
                    "cssSelectorsEnabled": "true",
                    "ignore-certificate-errors": "true",
                    "host": "ondemand.eu-central-1.saucelabs.com",
                    "port": 80,
                    "region": "eu",
                    "user": process.env.SAUCE_USERNAME,
                    "key": process.env.SAUCE_ACCESS_KEY,
                    "desiredCapabilities" : getDesiredCapabilities(),
                    "waitforTimeout": 60000,
                    "timeouts": {
                      "script": 60000,
                      "page load": 60000
                     }
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