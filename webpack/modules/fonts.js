module.exports = function () {
    return {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        include: /(node_modules|fonts)/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
        ]
    };
};
