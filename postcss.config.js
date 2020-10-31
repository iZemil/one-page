const { NODE_ENV } = process.env;
const cssnano = require('cssnano');

const isProduction = NODE_ENV === 'production';

module.exports = {
    exec: true,
    sourceMap: isProduction ? false : 'inline',
    plugins: [
        isProduction &&
            cssnano({
                autoprefixer: true,
                preset: [
                    'default',
                    {
                        discardComments: {
                            removeAll: true
                        }
                    }
                ]
            })
    ]
};
