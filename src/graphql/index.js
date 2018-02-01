const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const { graphql, buildASTSchema } = require('graphql');
const { parse } = require('graphql/language');
const { introspectionQuery } = require('graphql/utilities');
const { readFileSync, writeFileSync } = require('fs');
const initModels = require('./initModels');
const createRestforSchema = require('./createRestforSchema');
const createDefaultSchemas = require('./createDefaultSchemas');

module.exports = async ({ db: dbConfig, collections, schemas: schmemasPath, resolvers, modelsPath }) => {
  const { models, sequelize } = await initModels(dbConfig, modelsPath);
  const schemaFile = readFileSync(schmemasPath).toString();
  const ast = parse(schemaFile, { noLocation: true });
  const thirdPartySchema = buildASTSchema(ast);
  const restforSchema = createRestforSchema(collections, ast);
  const schema = createDefaultSchemas({ models, ast, restforSchema, schema: thirdPartySchema });
  const router = express.Router();
  router.get('/schemas', (req, res) => res.json(restforSchema));
  router.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({ schema: mergeSchemas({ schemas: [schema, schemaFile], resolvers }) })
  );
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/gql/graphql' }));
  return router;
};
