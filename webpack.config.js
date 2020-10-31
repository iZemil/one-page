const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

// Aliases
const alias = require('./webpack/alias');

// Paths
const { sourcePath, modulesPath, buildPath } = require('./webpack/paths');

// Utils
const optimization = require('./webpack/utils/optimization');
const optimizeCSS = require('./webpack/utils/optimizeCSS');
const packageJsonFields = require('./webpack/utils/packageJsonFields');

// Modules
const jsx = require('./webpack/modules/jsx');
const css = require('./webpack/modules/css');
const stylus = require('./webpack/modules/stylus');
const images = require('./webpack/modules/images');
const svg = require('./webpack/modules/svg');
const fonts = require('./webpack/modules/fonts');
const media = require('./webpack/modules/media');

// Plugins
const clear = require('./webpack/plugins/clear');
const extractStyles = require('./webpack/plugins/extractStyles');
const html = require('./webpack/plugins/html');

// Server
const devserver = require('./webpack/devserver');

// Common config
const config = {
    entry: {
        app: `${sourcePath}/index.jsx`
    },

    output: {
        path: buildPath,
        filename: 'js/[name].js'
    },

    module: {
        rules: [jsx(), css(), stylus(), fonts(), images(), svg(), media('pdf')]
    },

    resolve: {
        alias,
        modules: [sourcePath, modulesPath, 'node_modules'],
        plugins: [],
        extensions: ['.js', '.jsx', '.json', '.styl']
    },

    plugins: [
        clear('build'),
        extractStyles(),
        html({ icon: true }),
        new CopyPlugin([
            { from: './public/js', to: 'js' },
          ]),
        ]
};

module.exports = (env, argv) => {
    const { mode } = argv;

    config.mode = mode;

    if (mode === 'development') {
        config.devtool = 'inline-source-map';

        return merge([
            config,
            devserver(),
            {
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            BACKEND: JSON.stringify(process.env.BACKEND)
                        }
                    })
                ]
            }
        ]);
    }

    if (mode === 'production') {
        config.optimization = optimization;
        // config.output.publicPath = './cv';

        return merge([
            config,
            {
                plugins: [packageJsonFields('version', 'name'), optimizeCSS()]
            }
        ]);
    }

    return null;
};
