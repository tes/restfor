const fs = require('fs-extra');
const { basename, join } = require('path');

module.exports = resolversPath => {
  return resolversPath
    ? fs
        .readdirSync(resolversPath)
        .map(file => require(join(resolversPath, file)))
        .reduce((merge, resolver) => ({ ...merge, ...resolver }), {})
    : {};
};
