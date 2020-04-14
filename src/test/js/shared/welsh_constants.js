const TestData = require('./../config/test_data');

const localeParam = 'ui_locales';
const localeCookie = 'idam_ui_locales';

module.exports = {
    localeParam: localeParam,
    localeCookie: localeCookie,

    pageUrl: TestData.WEB_PUBLIC_URL,

    accessDeniedWelsh: 'Mynediad wedi\'i wrthod',
    pageUrlWithParamWelsh: `${TestData.WEB_PUBLIC_URL}?${localeParam}=cy`,
    pageUrlWithParamEnglish: `${TestData.WEB_PUBLIC_URL}?${localeParam}=en`,

    urlForceEn: `&${localeParam}=en`,
    urlForceCy: `&${localeParam}=cy`,
    urlInvalidLang: `&${localeParam}=invalid`,

    createAnAccountOrSignIn: 'Creu cyfrif neu fewngofnodi',
    createAnAccount: 'Creu cyfrif',
    continueBtn: 'Parhau',
    checkYourEmail: 'Gwiriwch eich negeseuon e-bost',
    youAlreadyHaveAccountSubject: 'Mae gennych gyfrif yn barod / You already have an account',
};
