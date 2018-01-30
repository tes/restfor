const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const getGraphqls = require('./getGraphqls');
const getResolvers = require('./getResolvers');

module.exports = ({ db: dbConfig, graphqlsPath, resolversPath }) => {
  const typeDefs = getGraphqls(graphqlsPath);
  const resolvers = getResolvers(resolversPath);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const router = express.Router();
  router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
