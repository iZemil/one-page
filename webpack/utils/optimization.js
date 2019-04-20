const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    concatenateModules: true,
    flagIncludedChunks: true,
    mangleWasmImports: true,
    mergeDuplicateChunks: true,
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                },
                warnings: false
            }
        })
    ],
    chunkIds: 'named',
    moduleIds: 'named',
    noEmitOnErrors: true,
    occurrenceOrder: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    runtimeChunk: 'single',
    sideEffects: true,
    splitChunks: {
        cacheGroups: {
            vendors: {
                chunks: 'initial',
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                enforce: true,
                priority: 1
            },
            theme: {
                chunks: 'initial',
                name: 'theme',
                test: /[\\/]src[\\/]theme[\\/][\w]+.(less|styl)$/,
                enforce: true,
                priority: 1
            }
        },
        maxAsyncRequests: 5
    },
    usedExports: true
};
