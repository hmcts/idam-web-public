var TestData = require('./config/test_data');

Feature('Self Registration');

const serviceName = 'TEST_SERVICE_' + Date.now();

BeforeSuite(async(I) => {
    return await I.createServiceData(serviceName);
});

AfterSuite(async(I) => {
    return await I.deleteService(serviceName);
});

Scenario('@functional @selfregister Self Register User Validation errors', (I) => {
    let url = TestData.WEB_PUBLIC_URL;

    I.amOnPage(url + '/users/selfRegister?redirect_uri=https://www.autotest.com&client_id=' + serviceName);
    I.waitInUrl('users/selfRegister', 180);
    I.waitForText('Create an account or sign in', 20, 'h1');
    I.see('Create an account');

    I.click("Continue");

    I.waitForText('Information is missing or invalid', 20, 'h2');
    I.see('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address')
    I.fillField('firstName', 'Lucy');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.see('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('lastName', 'Lu');
    I.click('Continue');
    I.wait(5);
    I.dontSee('You have not entered your first name');
    I.dontSee('You have not entered your last name');
    I.see('You have not entered your email address');
    I.fillField('email', '111');
    I.click('Continue');
    I.wait(5)
    I.see('Your email address is invalid');
    I.see('Sign in to your account.');
    I.click('Sign in to your account.');
    I.waitForText('Sign in', 20, 'h1');
    I.see('Sign in');
}).retry(0);
