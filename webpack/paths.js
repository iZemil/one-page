const fs = require('fs');
const path = require('path');

const rootPath = fs.realpathSync(process.cwd());

function resolvePath(relativePath) {
    return path.resolve(rootPath, relativePath);
}

module.exports = {
    rootPath,
    sourcePath: resolvePath('src'),
    buildPath: resolvePath('build'),
    publicPath: resolvePath('public'),
    assetsPath: resolvePath('assets'),
    modulesPath: resolvePath('node_modules')
};
