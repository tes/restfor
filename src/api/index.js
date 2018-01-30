require("babel-polyfill");
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const initModels = require('./initModels');
const initRouters = require('./initRouters');
const cors = require('cors');

module.exports = async ({ db: dbConfig, modelsPath, routesPath }) => {
  const { models, sequelize } = await initModels(dbConfig, modelsPath);
  const router = express.Router();
  router.use(cors());
  router.use(logger('dev'));
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(cookieParser());
  initRouters(models, routesPath, router);
  return router;
};
