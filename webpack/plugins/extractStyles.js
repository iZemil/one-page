const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function() {
    return new ExtractTextPlugin({
        filename: 'css/[name].css'
    });
};
