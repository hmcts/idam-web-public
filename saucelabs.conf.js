
const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');
//const conf = require('config');

const waitForTimeout = 60000;
const smartWait = 45000;
const browser = process.env.SAUCE_BROWSER || 'chrome';
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const getBrowserConfig = browserGroup => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
      desiredCapability.tunnelIdentifier = tunnelName;
      desiredCapability.tags = ['idam-web-punlic'];
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
  tests: './src/test/js/*_.js',
  output: `${process.cwd()}/functional-output`,
  helpers: {
    WebDriverIO: {
      url: process.env.TEST_URL,
      browser,
      waitForTimeout,
      smartWait,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      user: process.env.SAUCE_USERNAME ,
      key: process.env.SAUCE_ACCESS_KEY,
      desiredCapabilities: {}
    },
    SauceLabsReportingHelper: { require: './src/test/js/shared/sauceLabsReportingHelper.js' },

    IdamHelper: { require: './src/test/js/shared/idam_helper.js' },

  },
  include: { I: './src/test/js/shared/custom_steps.js' },
  mocha: {
    reporterOptions: {
      reportDir: `${process.cwd()}/functional-output`,
      reportName: 'index',
      inlineAssets: true
    }
  },
  multiple: {
    microsoftIE11: {
      browsers: getBrowserConfig('microsoftIE11')
    },
    microsoftEdge: {
      browsers: getBrowserConfig('microsoftEdge')
    },
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    },
    safari: {
      browsers: getBrowserConfig('safari')
    }
  },
  name: 'RFE Frontend Tests'
};

exports.config = setupConfig;
