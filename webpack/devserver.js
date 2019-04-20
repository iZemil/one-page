const { publicPath } = require('./paths');

module.exports = function() {
    return {
        devServer: {
            contentBase: publicPath,
            historyApiFallback: true,
            port: 3000
        }
    };
};
