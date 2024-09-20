const supportedBrowsers = require('./src/test/js/config/supportedBrowsers.js');

const waitForTimeout = 60000;
const smartWait = 5000;

const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  tags: ['idam-web-public'],
  extendedDebugging: true,
  capturePerformance: true
};

const getBrowserConfig = browserGroup => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
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
    plugins: {
        retryFailedStep: {
            enabled: true,
            retries: 2
        },
        autoDelay: {
            enabled: true,
            delayAfter: 2000
        }
    },
    include: {I: './src/test/js/shared/custom_steps.js'},
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {
                    steps: true
                }
            },
            'mocha-junit-reporter': {
                stdout: './functional-output/idam-web-public-mocha-stdout.log',
                options: {
                    mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './build/test-results/functional/idam-web-public-integration-result.xml'
                }
            },
            'mochawesome': {
                stdout: `./functional-output/idam-web-public-mochawesome-stdout.log`,
                options: {
                    reportDir: 'functional-output',
                    inlineAssets: true,
                }
            }
        }
    },
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