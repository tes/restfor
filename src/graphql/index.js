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
  const schemaFile = readFileSync(schmemasPath).toString() + '\n\nscalar Date';
  const ast = parse(schemaFile, { noLocation: true });
  const schema = buildASTSchema(ast);
  const restforSchema = createRestforSchema(collections, ast);
  const defaultSchemas = createDefaultSchemas({ ast, restforSchema, schema });
  //console.log(JSON.stringify(schemaDocument, null, 2));
  //console.log(JSON.stringify(restforSchema, null, 2));
  //const schema = mergeSchemas({ schemas, resolvers });
  //const schema = makeExecutableSchema({ typeDefs: schemas, resolvers });
  const router = express.Router();
  router.get('/schemas', (req, res) => res.json(restforSchema));
  //router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  //router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
