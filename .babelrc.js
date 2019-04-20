module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            { helpers: false, regenerator: true }
        ],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        ['import', { libraryName: 'antd' }]
    ],
    comments: true
};
