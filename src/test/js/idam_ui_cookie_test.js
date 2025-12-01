const assert = require('assert');
const TestData = require('./config/test_data');

const IDAM_UI_COOKIE = 'Idam.UI';
const serviceName = 'idam-functional-test-service';
const serviceRedirect = 'https://idam-functional-test-service';
const selfRegUrl = `${TestData.WEB_PUBLIC_URL}/users/selfRegister?redirect_uri=${serviceRedirect}&client_id=${serviceName}`;
const loginUrl = `${TestData.WEB_PUBLIC_URL}/login?redirect_uri=${serviceRedirect}&client_id=${serviceName}`;
const cookiesUrl = `${TestData.WEB_PUBLIC_URL}/cookies`;

Scenario('@functional @idamUiCookie', async ({ I }) => {
    const urls = [selfRegUrl, loginUrl, cookiesUrl];
    for (const url of urls) {
        I.amOnPage(url);
        const cookie = await I.grabCookie(IDAM_UI_COOKIE);
        assert(cookie !== null);
        assert.strictEqual(cookie.value, 'classic');
    }
});