const { GraphQLInt } = require('graphql/type');

module.exports.DEFAULT_PRIMARY_KEY_NAME = 'id';
module.exports.DEFAULT_PRIMARY_KEY_TYPE = GraphQLInt;
module.exports.DEFAULT_LIMIT = 1000;

module.exports.op = {
  EQ: 'eq',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  IN: 'in',
  CONTAINS: 'contains'
};

module.exports.directive = {
  PRIMARY_KEY: 'primaryKey',
  AUTO_GENERATE: 'auto',
  DEFAULT_VALUE: 'default'
};
