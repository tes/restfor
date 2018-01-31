const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools');
const { graphql, buildASTSchema } = require('graphql');
const { parse } = require('graphql/language');
const { introspectionQuery } = require('graphql/utilities');
const { readFileSync, writeFileSync } = require('fs');

module.exports = ({ db: dbConfig, schemas, resolvers }) => {
  console.log(JSON.stringify(parse(`
  type User {
    id: Int @primaryKey @auto
    name: String
  }
  
  type Task {
    id: Int @primaryKey @auto
    title: String @required
    taskType: TaskType
    checked: Boolean @default(value: false)
    userId: Int @required
  }
  
  enum TaskType {
    PRIMARY
    SECONDARY
  }
  
  `), null, 2))
  const schemaFile = readFileSync(schemas);
  const schemaDocument = parse(schemaFile);
  //const schema = mergeSchemas({ schemas, resolvers });
  //const schema = makeExecutableSchema({ typeDefs: schemas, resolvers });
  const router = express.Router();
  //router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
  //router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  return router;
};
