var TestData = require('./config/test_data');
var serviceName = 'TEST_SERVICE_' + Date.now();

Feature('Self Registration');

BeforeSuite(async(I) => {
    return await I.createServiceData(serviceName);
I.clearCookie();

})
;

AfterSuite(async(I) => {
    return await I.deleteService(serviceName);
})
;

Scenario('@functional Self Register User Validation errors', (I) => {

    I.amOnPage('/users/selfRegister?redirect_uri=https://www.autotest.com&client_id=' + serviceName);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');

    I.click("Continue");

    I.see('Information is missing or invalid');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address')
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.see('Your email address is invalid');
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.see('Sign in');


})
;
