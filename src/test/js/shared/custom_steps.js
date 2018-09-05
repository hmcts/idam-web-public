var TestData = require('../config/test_data');

module.exports = function () {

    return actor({

        loginToEmailInbox: function () {
            this.amOnPage('https://hotmail.co.uk');
            this.click({ xpath: "//A[@class='linkButtonSigninHeader'][text()='Sign in ']" });
            this.wait(4);
            this.fillField('#i0116', 'idamtests@outlook.com');
            this.wait(4);
            this.click('Next');
            this.wait(4);
            this.fillField('#i0118', 'Passw0rdSIDAM');
            this.click('#idSIButton9');
            this.wait(5);
        }

    })
}