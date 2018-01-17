const fs = require('fs-extra');
const { basename, join } = require('path');

moduel.exports = () => {
  const self = path.basename(__filename);
  return fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== self && file.slice(-3) === '.js')
    .reduce((routes, file) => ({ ...routes, [basename(file, '.js')]: require(join(__dirname, file)) }), {});
};
