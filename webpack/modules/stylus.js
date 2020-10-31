const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { rootPath } = require('../paths');

module.exports = () => {
    const opts = {
        minimize: true,
        sourceMap: true
    };

    return {
        test: /\.styl$/,
        exclude: /\.module\.styl$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: opts
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: `${rootPath}/postcss.config.js`
                        },
                        options: {
                            sourceMap: opts.sourceMap
                        }
                    }
                },
                {
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: opts.sourceMap
                    }
                }
            ],

            // For images and fonts
            publicPath: '../'
        })
    };
};
