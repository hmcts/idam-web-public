var TestData = require('./config/test_data');

Feature('Error message is displayed when trying to use an expired link');

Scenario('@smoke @expiredlinks I try to reset my password with an expired reset password link', (I) => {

  I.amOnPage('/passwordReset?action=start&token=invalidtoken&code=somecode');
  I.waitForText('Sorry, your link has expired', 180, 'h1');
  I.see('Please contact customer services for more information.');

});