var TestData = require('./config/test_data');

Feature('Login Page');

Scenario('@smoke Login Page', (I) => {
  I.amOnPage('/');

  I.see('Access Denied');
  I.seeCurrentUrlEquals('/login');

});