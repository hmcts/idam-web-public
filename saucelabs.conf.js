const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');
const browser = process.env.SAUCE_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const waitForTimeout = 60000;
const smartWait = 5000;

const getBrowserConfig = browserGroup => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
      desiredCapability.acceptSslCerts = true;
      desiredCapability.tunnelIdentifier = tunnelName;
      desiredCapability.tags = ['idam-web-public'];
      browserConfig.push({
        browser: desiredCapability.browserName,
        desiredCapabilities: desiredCapability
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
};

const setupConfig = {
  tests: './src/test/js/cross_browser_test.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    WebDriverIO: {
      url: process.env.TEST_URL,
      browser : 'chrome',
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      sauceConnect: true,
      services: ['sauce'],
      acceptSslCerts : true,
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      desiredCapabilities: { }
    },
    SauceLabsReportingHelper: { require: './src/test/js/shared/sauceLabsReportingHelper.js' },
    idam_helper: { require: './src/test/js/shared/idam_helper.js' }
   },
  include: { I: './src/test/js/shared/custom_steps.js' },

  multiple: {
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