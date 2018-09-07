var TestData = require('./config/test_data');

Feature('Login Page');

Scenario('@smoke Login Page', (I) => {
  I.amOnPage('/');
  I.waitForText('Access Denied');
  I.seeCurrentUrlEquals('/login');
}).retry(TestData.SCENARIO_RETRY_LIMIT);