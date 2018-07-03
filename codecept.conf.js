const TestData = require('./src/test/js/config/test_data')

exports.config = {
  name: 'idam-web-public',
  tests: './src/test/js/**/*_test.js',
  output: './output',
  timeout: 10000,
  bootstrap: false,
  helpers: {
    Puppeteer: {
      url: TestData.WEB_PUBLIC_URL,
      waitTimeout: 10000,
      waitForTimeout: 10000,
      waitForAction: 1500,
      chrome: {
        //args: ["--proxy-server=" + process.env.PROXY_SERVER],
        ignoreHTTPSErrors: true
      }
    }
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