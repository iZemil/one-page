const webpack = require('webpack');
const package = require('../../package.json');

module.exports = function(...fieldNames) {
    let fields = {};

    fieldNames.forEach(
        fieldName => (fields[fieldName] = JSON.stringify(package[fieldName]))
    );

    return new webpack.DefinePlugin({
        'process.env': { ...fields }
    });
};
