var TestData = require('../config/test_data');

module.exports = function() {
  return actor({

    lockAccount: function (email) {
        this.fillField('username', email);
        this.fillField('password', '111');
        this.click('Sign in');
        this.fillField('password', '111');
        this.click('Sign in');
        this.fillField('password', '111');
        this.click('Sign in');
        this.fillField('password', '111');
        this.click('Sign in');
        this.fillField('password', '111');
        this.click('Sign in');
    }
  })
}