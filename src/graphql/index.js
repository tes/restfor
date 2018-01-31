const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const { graphql, buildASTSchema } = require('graphql');
const { parse } = require('graphql/language');
const { introspectionQuery } = require('graphql/utilities');
const { readFileSync, writeFileSync } = require('fs');
const createRestforSchema = require('./createRestforSchema');

module.exports = ({ db: dbConfig, collections, schemas, resolvers }) => {
  const schemaFile = readFileSync(schemas).toString();
  const schemaDocument = parse(schemaFile, { noLocation: true });
  const restforSchema = createRestforSchema(collections, schemaDocument);
  //console.log(JSON.stringify(schemaDocument, null, 2));
  console.log(JSON.stringify(restforSchema, null, 2));
  //const schema = mergeSchemas({ schemas, resolvers });
  //const schema = makeExecutableSchema({ typeDefs: schemas, resolvers });
  const router = express.Router();
  router.get('/schemas', (req, res) => res.json(restforSchema));
  //router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  //router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
