const { statSync, readdirSync, readFileSync } = require('fs-extra');
const { join } = require('path');
const merge = require('deepmerge');

module.exports = resolversPath => {
  const isDir = statSync(resolversPath).isDirectory();
  const files = isDir ? readdirSync(resolversPath) : [resolversPath];
  return files
    .map(file => require(join(resolversPath, file)))
    .reduce((resolvers, resolver) => merge(resolvers, resolver), {});
};
