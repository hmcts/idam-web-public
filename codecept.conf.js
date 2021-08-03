const TestData = require('./src/test/js/config/test_data')

exports.config = {
    name: 'idam-web-public',
    tests: './src/test/js/**/*_test.js',
    output: './output',
    fullPageScreenshots: true,
    timeout: 180000,
    bootstrap: false,
    helpers: {
        Puppeteer: {
            // show: true,
            url: TestData.WEB_PUBLIC_URL,
            waitForTimeout: 60000,
            waitForAction: 3000,
            windowSize: "1280x960",
            getPageTimeout: 30000,
            chrome: {
                //args: ["--proxy-server=" + process.env.PROXY_SERVER],
                ignoreHTTPSErrors: true
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
        }
    },
    "include": {
        "I": "./src/test/js/shared/custom_steps.js"
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
                stdout: './output/idam-web-public-mocha-stdout.log',
                options: {
                    mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './build/test-results/codeceptjs/idam-web-public-integration-result.xml'
                }
            },
            'mochawesome': {
                stdout: `./output/idam-web-public-mochawesome-stdout.log`,
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