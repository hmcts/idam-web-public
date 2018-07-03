var TestData = require('./config/test_data');

Feature('Login Page');

Scenario('@smoke Login Page', (I) => {
  I.amOnPage('/');

  I.see('Access Denied');
  I.seeCurrentUrlEquals('/login');

});

Scenario('@functional Login Page (func)', (I) => {
  I.amOnPage('/');

  I.see('Access Denied');
  I.seeCurrentUrlEquals('/login');

});