const { statSync, readdirSync, readFileSync } = require('fs-extra');

module.exports = schemasPath => {
  const isDir = statSync(schemasPath).isDirectory();
  const files = isDir ? readdirSync(schemasPath) : [schemasPath];
  return files.map(file => readFileSync(file).toString()).join('\n\n');
};
