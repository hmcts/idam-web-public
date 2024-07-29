const TestData = require('../config/test_data');
const randomData = require('./random_data');

module.exports = function() {
  return actor({

    lockAccount: function (email, serviceName) {
        const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=`;

        // First attempt
        this.amOnPage(loginPage);
        this.waitForText('Sign in');
        this.fillField('username', email);
        this.fillField('password', randomData.getRandomUserPassword());
        this.click('Sign in');
        this.wait(2);
        this.waitForText('Incorrect email or password');
        // Second attempt
        this.clearField('username');
        this.fillField('username', email);
        this.clearField('password');
        this.fillField('password', randomData.getRandomUserPassword());
        this.click('Sign in');
        this.wait(2);
        this.waitForText('Incorrect email or password');
        // Third attempt
        this.clearField('username');
        this.fillField('username', email);
        this.clearField('password');
        this.fillField('password', randomData.getRandomUserPassword());
        this.click('Sign in');
        this.wait(2);
        this.waitForText('Incorrect email or password');
        // Fourth attempt
        this.clearField('username');
        this.fillField('username', email);
        this.clearField('password');
        this.fillField('password', randomData.getRandomUserPassword());
        this.click('Sign in');
        this.wait(2);
        this.waitForText('Incorrect email or password');
        // Fifth attempt
        this.clearField('username');
        this.fillField('username', email);
        this.clearField('password');
        this.fillField('password', randomData.getRandomUserPassword());
        this.click('Sign in');
        this.wait(2);
        this.waitForText('There is a problem with your account login details');
        this.see('Your account is locked due to too many unsuccessful attempts.');
        this.see('You can reset your password');
    }
  })
}