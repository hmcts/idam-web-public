const supportedBrowsers = {
    microsoft: {
        edge: {
            browserName: 'MicrosoftEdge',
            name: 'Edge',
            platform: 'Windows 10',
            ignoreZoomSetting: true,
            nativeEvents: false,
            ignoreProtectedModeSettings: true,
            version: '17.17134'
        }
    },
    chrome: {
        chrome_win_latest: {
            browserName: 'chrome',
            name: 'WIN_CHROME_LATEST',
            platform: 'Windows 10',
            version: 'latest'
        },
        chrome_mac_latest: {
            browserName: 'chrome',
            name: 'MAC_CHROME_LATEST',
            platform: 'macOS 10.13',
            version: 'latest'
        }
<<<<<<< HEAD
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            name: 'WIN_FIREFOX_LATEST',
            platform: 'Windows 10',
            version: 'latest'
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            name: 'MAC_FIREFOX_LATEST',
            platform: 'macOS 10.13',
            version: 'latest'
        }
    },
    safari: {
        safari11: {
            browserName: 'safari',
            name: 'SAFARI_11',
            platform: 'macOS 10.14',
            version: 'latest',
            avoidProxy: true
=======
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            name: 'WIN_FIREFOX_LATEST',
            platform: 'Windows 10',
            version: 'latest'
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            name: 'MAC_FIREFOX_LATEST',
            platform: 'macOS 10.13',
            version: 'latest'
>>>>>>> 0b78939f864adf8756c96492072a3852b96ddf6f
        }
    }
};

module.exports = supportedBrowsers;