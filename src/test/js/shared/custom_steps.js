const TestData = require('../config/test_data');

module.exports = function() {
  return actor({

    lockAccount: function (email, serviceName) {
        const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=`;

        // First
        this.amOnPage(loginPage + 'attemptone');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password');
        this.retry({retries:3, minTimeout:1000}).seeInCurrentUrl('state', 'attemptone');
        this.clearCookie();
        // Second
        this.amOnPage(loginPage + 'attempttwo');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.dontSeeInCurrentUrl('attemptone');
        this.fillField('username', email);
        this.fillField('password', '111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password');
        this.retry({retries:3, minTimeout:1000}).seeInCurrentUrl('state', 'attempttwo');
        this.clearCookie();
        // Third
        this.amOnPage(loginPage + 'attemptthree');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.dontSeeInCurrentUrl('attemptone');
        this.dontSeeInCurrentUrl('attempttwo');
        this.fillField('username', email);
        this.fillField('password', '111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password');
        this.retry({retries:3, minTimeout:1000}).seeInCurrentUrl('state', 'attemptthree');
        this.clearCookie();
        // Fourth
        this.amOnPage(loginPage + 'attemptfour');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.dontSeeInCurrentUrl('attemptone');
        this.dontSeeInCurrentUrl('attempttwo');
        this.dontSeeInCurrentUrl('attemptthree');
        this.fillField('username', email);
        this.fillField('password', '111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('Incorrect email or password');
        this.retry({retries:3, minTimeout:1000}).seeInCurrentUrl('state', 'attemptfour');
        this.clearCookie();
        // NOTE: This fifth attempt should have locked the account, but we will do one more to be sure.
        // I think this is required because of a timing issue.
        // Fifth
        this.amOnPage(loginPage + 'attemptfive');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.dontSeeInCurrentUrl('attemptone');
        this.dontSeeInCurrentUrl('attempttwo');
        this.dontSeeInCurrentUrl('attemptthree');
        this.dontSeeInCurrentUrl('attemptfour');
        this.fillField('username', email);
        this.fillField('password', '111111111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.wait(5);
        // Final
        this.amOnPage(loginPage + 'attemptfinal');
        this.waitForText('Sign in');
        this.dontSee('Incorrect email or password');
        this.dontSeeInCurrentUrl('attemptone');
        this.dontSeeInCurrentUrl('attempttwo');
        this.dontSeeInCurrentUrl('attemptthree');
        this.dontSeeInCurrentUrl('attemptfour');
        this.dontSeeInCurrentUrl('attemptfive');
        this.fillField('username', email);
        this.fillField('password', '111111111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitForText('There is a problem with your account login details');
        this.retry({retries:3, minTimeout:1000}).seeInCurrentUrl('state', 'attemptfinal');
        this.see('Your account is locked due to too many unsuccessful attempts.');
        this.see('You can reset your password');
    }
  })
}