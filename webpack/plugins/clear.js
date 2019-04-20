const CleanWebpackPlugin = require('clean-webpack-plugin');

const { rootPath } = require('../paths');

module.exports = function(dirName) {
    return new CleanWebpackPlugin([dirName], {
        root: rootPath
    });
};
