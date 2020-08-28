const TestData = require('./src/test/js/config/test_data')

module.exports = {
    timeout: 360000,
    allowedStandards: ['WCAG2AA', 'HMCTS Standards'],
    ignore: [
        'WCAG2AA.Principle1.Guideline1_4.1_4_3_F24.F24.FGColour',
        'WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2',
        'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage',
        'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.BgImage'
    ]
};