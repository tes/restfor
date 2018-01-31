const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const { graphql, buildASTSchema } = require('graphql');
const { parse } = require('graphql/language');
const { introspectionQuery } = require('graphql/utilities');
const { readFileSync, writeFileSync } = require('fs');
const createRestforSchema = require('./createRestforSchema');
const createDefaultSchemas = require('./createDefaultSchemas');

module.exports = ({ db: dbConfig, collections, schemas: schmemasPath, resolvers }) => {
  const schemaFile = readFileSync(schmemasPath).toString();
  const ast = parse(schemaFile, { noLocation: true });
  const thirdPartySchema = buildASTSchema(ast);
  const restforSchema = createRestforSchema(collections, ast);
  const schemas = createDefaultSchemas({ ast, restforSchema, schema: thirdPartySchema });
  //console.log(schemas)
  //console.log(JSON.stringify(schemaDocument, null, 2));
  //console.log(JSON.stringify(restforSchema, null, 2));

  const router = express.Router();
  router.get('/schemas', (req, res) => res.json(restforSchema));
  router.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({ schema: mergeSchemas({ schemas: [schemas, schemaFile], resolvers }) })
  );
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
