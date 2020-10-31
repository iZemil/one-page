const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(options) {
    const opts = Object.assign(
        {
            minimize: true,
            sourceMap: false
        },
        options
    );

    return {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: opts
                }
            ],

            // For images and fonts
            publicPath: '../'
        })
    };
};
