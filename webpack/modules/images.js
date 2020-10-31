module.exports = function() {
    return {
        test: /\.(png|jpe?g|gif)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            }
        ]
    };
};
