var TestData = require('./config/test_data');

Feature('Login Page');

Scenario('@smoke Login Page', (I) => {
  I.amOnPage('/');
  I.waitForText('Access Denied');
  I.seeCurrentUrlEquals('/login');
}).retry(TestData.SCENARIO_RETRY_LIMIT);

Scenario('@smoke after forgot password you do not see create an account options for invalid clients', (I) => {
  I.amOnPage(TestData.WEB_PUBLIC_URL + '/login?client_id=abc&redirect_uri=xyz');
  I.waitInUrl('/login', 180);
  I.waitForText('Sign in', 20, 'h1');
  I.click('Forgotten password?');
  I.waitInUrl('/reset/forgotpassword', 180);
  I.waitForElement('#email', 30);
  I.fillField('#email', 'resetpasswordtest@mailtest.gov.uk');
  I.click('Submit');
  I.waitInUrl('reset/doForgotPassword', 180);
  I.waitForText('Check your email', 20, 'h1');
  I.waitForText('If you have entered an email address that is not connected with an account, you will not receive an email. You will need to contact us to create an account', 20);
}).retry(TestData.SCENARIO_RETRY_LIMIT);
