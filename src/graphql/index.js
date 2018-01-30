const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const getSchemas = require('./getSchemas');
const getResolvers = require('./getResolvers');

module.exports = ({ db: dbConfig, schemasPath, resolversPath }) => {
  const typeDefs = getSchemas(schemasPath);
  const resolvers = getResolvers(resolversPath);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const router = express.Router();
  router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
