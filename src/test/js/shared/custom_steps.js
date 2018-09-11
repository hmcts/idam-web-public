var TestData = require('../config/test_data');

module.exports = function() {
  return actor({

    lockAccount: function (email, serviceName) {
        var loginPage = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=https://idam.testservice.gov.uk&client_id=' + serviceName + '&state=';

        // First
        this.amOnPage(loginPage);
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Second
        this.amOnPage(loginPage);
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Third
        this.amOnPage(loginPage);
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Fourth
        this.amOnPage(loginPage);
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Fifth
        this.amOnPage(loginPage);
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('There is a problem with your account login details', 20, 'h2');
        this.see('Your account is locked due to too many unsuccessful attempts.');
        this.see('You can reset your password');
    }
  })
}