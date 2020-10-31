module.exports = function(...fileTypes) {
    return {
        test: new RegExp(`\.(${fileTypes.join('|')})$`),
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'media/'
                }
            }
        ]
    };
};
