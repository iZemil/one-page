module.exports = function() {
    return {
        test: /\.svg$/,
        exclude: /(node_modules|fonts|_images)/, // _images need for svg raw loading
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
