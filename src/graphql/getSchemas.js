const fs = require('fs-extra');
const { basename, join } = require('path');

module.exports = schemasPath => {
  return schemasPath
    ? fs
        .readdirSync(schemasPath)
        .reduce((graphql, file) => graphql + '\n\n' + fs.readFileSync(join(schemasPath, file)).toString(), '')
    : '';
};
