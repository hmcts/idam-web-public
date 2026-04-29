const path = require('path');
const TestData = require('./src/test/js/config/test_data');

const functionalOutput = path.join(process.cwd(), 'functional-output', 'functional', 'reports');

exports.config = {
    name: 'idam-web-public',
    tests: './src/test/js/**/*_test.js',
    output: functionalOutput,
    fullPageScreenshots: true,
    timeout: 240, // seconds
    bootstrap: false,
    retry: 3,
    helpers: {
        Playwright: {
            show: false,
            url: TestData.WEB_PUBLIC_URL,
            browser: process.env.BROWSER || 'chromium',
            waitForTimeout: 60000,
            waitForAction: TestData.WAIT_FOR_ACTION_TIMEOUT,
            windowSize: "1280x960",
            getPageTimeout: 20000,
            ignoreHTTPSErrors: true,
            chromium: {
                args: ["--no-sandbox"]
            }
        },
        idam_helper: {
            "require": "./src/test/js/shared/idam_helper.js"
        },
        refdata_helper: {
            "require": "./src/test/js/shared/refdata_helper.js"
        },
        GenerateReportHelper: {
            require: "./src/test/js/shared/generate_report_helper.js"
        },
        Mochawesome: {
            uniqueScreenshotNames: true
        }
    },
    "include": {
        "I": "./src/test/js/shared/custom_steps.js"
    },
    plugins: {
        allure: {
            enabled: true,
            require: '@codeceptjs/allure-legacy'
        }
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {
                    verbose: true,
                    steps: true
                }
            },
            'mocha-junit-reporter': {
                stdout: './output/idam-web-public-mocha--junit-stdout.log',
                options: {
                    mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './build/test-results/functional/idam-web-public-integration-result.xml',
                    attachments: true
                }
            },
            'mochawesome': {
                stdout: './output/idam-web-public-mochawesome-stdout.log',
                options: {
                    reportDir: 'output',
                    reportFilename: 'idam-web-public-e2e-result',
                    inlineAssets: true,
                    reportTitle: `IDAM Web Public E2E tests result`
                }
            }
        }
    }
};
