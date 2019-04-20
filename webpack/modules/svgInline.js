module.exports = function() {
    return {
        test: /\.svg$/,
        exclude: /(node_modules|fonts)/,
        use: [
            {
                loader: 'babel-loader'
            },
            {
                loader: 'react-svg-loader',
                options: {
                    jsx: true, // true outputs JSX tags
                    svgo: {
                        pretty: true,
                        plugins: [{ removeTitle: false }],
                        floatPrecision: 2
                    }
                }
            }
        ]
    };
};
