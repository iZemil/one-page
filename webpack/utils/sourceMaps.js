const webpack = require('webpack');

module.exports = function() {
    return new webpack.SourceMapDevToolPlugin({
        test: [/\.js$/, /\.jsx$/],
        filename: '[file].map',
        exclude: ['js/vendors']
    });
};
