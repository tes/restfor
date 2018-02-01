require('babel-polyfill');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const { graphiqlExpress } = require('apollo-server-express');
const getModels = require('./getModels');
const getSequelizeRouterAndSchema = require('./sequelize/getRouterAndSchema');
const getGraphqlRouterAndSchema = require('./graphql/getRouterAndSchema');
const schemaService = require('./schemaService');

module.exports = async ({ db: dbConfig, collections, modelsPath, routesPath, schemasPath, resolversPath }) => {
  const { models, sequelize } = await getModels(dbConfig, modelsPath);
  const router = express.Router();
  router.use(cors());
  router.use(logger('dev'));
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(cookieParser());
  const { schema: sequelizeSchema, router: sequelizeRouter } = getSequelizeRouterAndSchema(models, routesPath);
  const { schama: graphqlSchema, router: graphqlRouter } = await getGraphqlRouterAndSchema(
    models,
    collections,
    schemasPath,
    resolversPath
  );
  router.get('/schemas', schemaService(sequelizeSchema, graphqlSchema));
  router.use('/sequelize', sequelizeRouter);
  router.use('/graphql', graphqlRouter);
  router.use('/graphiql', graphiqlExpress({ endpointURL: '/api/graphql' }));
  return router;
};
