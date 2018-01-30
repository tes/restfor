const fs = require('fs-extra');
const { basename, join } = require('path');

module.exports = graphqlsPath => {
  return graphqlsPath
    ? fs
        .readdirSync(graphqlsPath)
        .reduce((graphql, file) => graphql + '\n\n' + fs.readFileSync(join(graphqlsPath, file)).toString(), '')
    : '';
};
