const { statSync, readdirSync, readFileSync } = require('fs-extra');

module.exports = resolversPath => {
  const isDir = statSync(resolversPath).isDirectory();
  const files = isDir ? readdirSync(resolversPath) : [resolversPath];
  return files.map(file => require(file));
};
