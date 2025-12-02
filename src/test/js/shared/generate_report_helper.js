const testConfig = require('../config/test_data');

class Generate_report_helper extends Helper {

  _finishTest() {
    if (!testConfig.TestForAccessibility) {
      return;
    }
    // Lazy load accessibility modules only when needed
    const {getAccessibilityTestResult} = require('./accessibility/runner');
    const {generateAccessibilityReport} = require('../reporters/accessibility-reporter/customReporter');
    generateAccessibilityReport(getAccessibilityTestResult());
  }

}
module.exports = Generate_report_helper;
