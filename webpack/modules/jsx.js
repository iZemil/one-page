module.exports = function() {
    return {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
    };
};
