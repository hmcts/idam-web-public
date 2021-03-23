var TestData = require('./config/test_data');

Feature('Error message is displayed when trying to use an expired link');

Scenario('@smoke @expiredlinks I try to reset my password with an expired reset password link', ({ I }) => {

  I.amOnPage('/passwordReset?action=start&token=invalidtoken&code=somecode');
  I.waitForText('Your link has expired, or has already been used');
  I.see('For security, your link is only valid for 48 hours.');

}).retry(TestData.SCENARIO_RETRY_LIMIT);