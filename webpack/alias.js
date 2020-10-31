const fs = require('fs');
const { sourcePath } = require('./paths');

const isDirectory = source => fs.lstatSync(source).isDirectory();

const getSourceDirectoryAliases = (srcPath) => {
    let aliases = {};

    fs.readdirSync(srcPath).forEach(item => {
        const itemPath = `${srcPath}/${item}`;

        if (isDirectory(itemPath)) {
            aliases[item] = itemPath;
        }
    });

    return aliases;
};

module.exports = {
    src: `${sourcePath}`,
    ...getSourceDirectoryAliases(sourcePath)
};
