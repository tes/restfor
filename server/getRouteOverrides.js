const fs = require('fs-extra');
const { basename, join } = require('path');

module.exports = routesPath => {
  return fs
    .readdirSync(routesPath)
    .reduce((routes, file) => ({ ...routes, [basename(file, '.js')]: require(join(routesPath, file)) }), {});
};
