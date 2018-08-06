const TestData = require('./src/test/js/config/test_data')

module.exports = {
    timeout: 360000,
    allowedStandards: ['WCAG2AA', 'HMCTS Standards'],
    chromeLaunchConfig: {
      ignoreHTTPSErrors: false
    }
};