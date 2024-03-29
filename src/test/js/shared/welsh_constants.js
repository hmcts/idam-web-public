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
    createAPassword: 'Creu cyfrinair',
    userActivationTitle: 'Actifadu Cyfrif Defnyddiwr - Mynediad GLlTEM - GOV.UK',
    accountCreated: 'Mae eich cyfrif wedi cael ei greu',
    youCanNowSignInWithYourNewPassword: 'Gallwch nawr fewngofnodi gyda’ch cyfrinair newydd.',
    youCanNowSignIn: 'Gallwch nawr fewngofnodi i’ch cyfrif.',
    signIn: 'Mewngofnodi',
    signInOrCreateAccount: 'Mewngofnodi neu greu cyfrif',
    forgottenPassword: 'Wedi anghofio eich cyfrinair?',
    resetYourPassword: 'Ailosod eich cyfrinair',
    youNeedToResetYourPassword: 'Mae angen ichi ailosod eich cyfrinair',
    staleUserErrorMessage: 'Gan nad ydych wedi mewngofnodi i’r gwasanaeth yn ystod y 90 diwrnod diwethaf, mae angen ichi ailosod eich cyfrinair',
    submitBtn: 'Cyflwyno',
    createANewPassword: 'Creu cyfrinair newydd',
    passwordChanged: 'Mae eich cyfrinair wedi cael ei newid',
    verificationRequired: 'Mae angen dilysu eich cyfrif'
};
