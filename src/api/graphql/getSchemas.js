const { statSync, readdirSync, readFileSync } = require('fs-extra');
const { join } = require('path');

module.exports = schemasPath => {
  const isDir = statSync(schemasPath).isDirectory();
  const files = isDir ? readdirSync(schemasPath) : [schemasPath];
  return files.map(file => readFileSync(join(schemasPath, file)).toString()).join('\n\n');
};
