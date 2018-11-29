var TestData = require('../config/test_data');

module.exports = function() {
  return actor({

    lockAccount: function (email, serviceName) {
        var loginPage = TestData.WEB_PUBLIC_URL + '/login?redirect_uri=https://idam.testservice.gov.uk&client_id=' + serviceName + '&state=';

        // First
        this.amOnPage(loginPage + 'attemptone');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.fillField('username', email);
        this.fillField('password', '111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitInUrl('/authorize', 60);
        this.retry({retries:3, minTimeout:1000}).seeInField('#state', 'attemptone');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Second
        this.amOnPage(loginPage + 'attempttwo');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.dontSeeInField('#state', 'attemptone');
        this.fillField('username', email);
        this.fillField('password', '111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitInUrl('/authorize', 60);
        this.retry({retries:3, minTimeout:1000}).seeInField('#state', 'attempttwo');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Third
        this.amOnPage(loginPage + 'attemptthree');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.dontSeeInField('#state', 'attemptone');
        this.dontSeeInField('#state', 'attempttwo');
        this.fillField('username', email);
        this.fillField('password', '111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitInUrl('/authorize', 60);
        this.retry({retries:3, minTimeout:1000}).seeInField('#state', 'attemptthree');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // Fourth
        this.amOnPage(loginPage + 'attemptfour');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.dontSeeInField('#state', 'attemptone');
        this.dontSeeInField('#state', 'attempttwo');
        this.dontSeeInField('#state', 'attemptthree');
        this.fillField('username', email);
        this.fillField('password', '111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitInUrl('/authorize', 60);
        this.retry({retries:3, minTimeout:1000}).seeInField('#state', 'attemptfour');
        this.waitForText('Incorrect email or password', 20, 'h2');
        this.clearCookie();
        // NOTE: This fifth attempt should have locked the account, but we will do one more to be sure.
        // I think this is required because of a timing issue.
        // Fifth
        this.amOnPage(loginPage + 'attemptfive');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.dontSeeInField('#state', 'attemptone');
        this.dontSeeInField('#state', 'attempttwo');
        this.dontSeeInField('#state', 'attemptthree');
        this.dontSeeInField('#state', 'attemptfour');
        this.fillField('username', email);
        this.fillField('password', '111111111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.wait(10);
        // Final
        this.amOnPage(loginPage + 'attemptfinal');
        this.waitForText('Sign in', 180, 'h1');
        this.dontSee('Incorrect email or password');
        this.dontSeeInField('#state', 'attemptone');
        this.dontSeeInField('#state', 'attempttwo');
        this.dontSeeInField('#state', 'attemptthree');
        this.dontSeeInField('#state', 'attemptfour');
        this.dontSeeInField('#state', 'attemptfive');
        this.fillField('username', email);
        this.fillField('password', '111111111111111111');
        this.scrollPageToBottom();
        this.click('Sign in');
        this.waitInUrl('/authorize', 60);
        this.retry({retries:3, minTimeout:1000}).seeInField('#state', 'attemptfinal');
        this.waitForText('There is a problem with your account login details', 20, 'h2');
        this.see('Your account is locked due to too many unsuccessful attempts.');
        this.see('You can reset your password');
    }
  })
}