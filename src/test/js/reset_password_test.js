var TestData = require('./config/test_data');


Feature('I am able to reset my password');

BeforeSuite(async (I) => {
    email_admin = "admin_test1@sidam.33mail.com"
    return I.createUser(email_admin, "admin_test", "admin", 'IDAM_ADMIN_USER');
});

AfterSuite((I) => {
    return I.deleteUser(email_admin);
});

Scenario('@functional I am able to reset my password', function* (I) {
    I.amOnPage("/reset/forgotpassword");
    I.fillField('#email', 'admin_test1@sidam.33mail.com');
    I.click('Submit');
    I.wait(3);
    I.see('Check your email');
    I.loginToEmailInbox();
    I.wait(7);
    var value = yield I.grabAttributeFrom('tbody > tr:nth-of-type(2) > td:nth-of-type(2) > p:nth-of-type(3) > a', 'href');
    I.click('Delete');
    I.amOnPage(value);
    I.wait('#password1');
    I.fillField('#password1', 'Passw0rdIDAM');
    I.fillField('#password2', 'Passw0rdIDAM');
    I.click('input.button');
    I.wait('#heading-large');
    I.see('Your password has been changed');
});