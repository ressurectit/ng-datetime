const AngularCompilerPlugin =  require('@ngtools/webpack').AngularCompilerPlugin,
      path = require('path');

process.env.CHROME_BIN = require('puppeteer').executablePath();

// karma.conf.js
module.exports = function(config: any)
{
    config.set(
    {
        basePath: '.',
        browsers: ['ChromeHeadlessNS'],
        customLaunchers:
        {
            ChromeHeadlessNS:
            {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        frameworks: ['jasmine', 'webpack'],
        plugins:
        [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-webpack'
        ],
        preprocessors:
        {
            'tests/**/*.ts': ['webpack']
        },
        files:
        [
            {
                pattern: 'tests/**/*.ts',
                watched: false
            }
        ],
        reporters: ['progress'],
        webpack:
        {
            module:
            {
                rules:
                [
                    //file processing
                    {
                        test: /\.ts$/,
                        loader: '@ngtools/webpack'
                    }
                ]
            },
            plugins:
            [
                new AngularCompilerPlugin(
                {
                    tsConfigPath: path.join(__dirname, 'tsconfig.karma.json'),
                    sourceMap: true
                })
            ]
        }
    });
};