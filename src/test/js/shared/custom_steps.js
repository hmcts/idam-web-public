const TestData = require('../config/test_data');
const randomData = require('./random_data');
const {container} = require('codeceptjs');

module.exports = function() {
  return actor({

    lockAccount: function (email, serviceName) {
        const loginPage = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${TestData.SERVICE_REDIRECT_URI}&client_id=${serviceName}&state=`;

        // First attempt
        this.amOnPage(loginPage);
        this.see('Sign in');
        this.fillField('username', email);
        this.fillField('password', randomData.getRandomUserPassword());
        this.clickWithWait('Sign in');
        this.waitForText('Incorrect email or password');
        // Second attempt
        this.fillField('password', randomData.getRandomUserPassword());
        this.clickWithWait('Sign in');
        // Third attempt
        this.fillField('password', randomData.getRandomUserPassword());
        this.clickWithWait('Sign in');
        // Fourth attempt
        this.fillField('password', randomData.getRandomUserPassword());
        this.clickWithWait('Sign in');
        // Fifth attempt
        this.fillField('password', randomData.getRandomUserPassword());
        this.clickWithWait('Sign in');
        this.waitForText('There is a problem with your account login details');
        this.see('Your account is locked due to too many unsuccessful attempts.');
        this.see('You can reset your password');
    },
    clickWithWait : function(clickText) {
        this.click(clickText);
        this.wait(1);
    },
    // If the cookie value exceeds 10KB, Playwright limits the cookie value, so JavaScript is used to set the cookie explicitly.
    addCookie: async function(cookieName, cookieValue) {
        await this.executeScript(({name, value}) => {
            window.document.cookie = `${name}=${value};path=/`;
        }, {name: cookieName, value: cookieValue});
    },
    addReportContext: function(context) {
        const allure = container.plugins('allure');

        if (allure) {
            allure.addAttachment('Context', String(context), 'text/plain');
        }
    }
  })
}
