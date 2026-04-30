const path = require('path');
const TestData = require('./src/test/js/config/test_data');
const {container, event} = require('codeceptjs');

const output = path.join(process.cwd(), 'functional-output', 'cross-browser', 'reports');

exports.config = {
    name: 'cross-browser',
    tests: './src/test/js/cross_browser_test.js',
    output,
    fullPageScreenshots: true,
    timeout: 240,
    bootstrap: false,
    retry: 3,
    helpers: {
        Playwright: {
            show: false,
            url: TestData.WEB_PUBLIC_URL,
            browser: process.env.BROWSER || 'chromium',
            waitForTimeout: 60000,
            waitForAction: TestData.WAIT_FOR_ACTION_TIMEOUT,
            windowSize: '1280x960',
            getPageTimeout: 20000,
            ignoreHTTPSErrors: true,
            bypassCSP: true,
            chromium: {
                args: ['--no-sandbox']
            }
        },
        idam_helper: {
            require: './src/test/js/shared/idam_helper.js'
        },
        GenerateReportHelper: {
            require: './src/test/js/shared/generate_report_helper.js'
        }
    },
    plugins: {
        allure: {
            enabled: true,
            require: '@codeceptjs/allure-legacy'
        },
        retryFailedStep: {
            enabled: true,
            retries: 2
        },
        autoDelay: {
            enabled: true,
            delayAfter: 2000
        }
    },
    include: {
        I: './src/test/js/shared/custom_steps.js'
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {
                    steps: true
                }
            },
            'mocha-junit-reporter': {
                stdout: path.join(output, 'idam-web-public-cross-browser-stdout.log'),
                options: {
                    mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './build/test-results/functional/idam-web-public-cross-browser-result-[hash].xml'
                }
            }
        }
    },
    multiple: {
        chromium: {
            browsers: [{browser: 'chromium'}]
        },
        webkit: {
            browsers: [{browser: 'webkit'}]
        },
        firefox: {
            browsers: [{browser: 'firefox'}]
        }
    }
};

event.dispatcher.on(event.test.after, () => {
    try {
        const {allure} = container.plugins();
        const browser = container.helpers().Playwright.browser._initializer;

        allure.epic(browser.name);
        allure.addParameter('environment', 'Browser', browser.name);
        allure.addParameter('environment', 'Version', browser.version);
    } catch (error) {
        console.log(`Unable to add Allure browser metadata: ${error.message}`);
    }
});
