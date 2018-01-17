const config = require('config');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const initModels = require('./models');
const initRouters = require('./initRouters');
const getRouteOverrides = require('./routes');
const cors = require('cors');

const initApp = async ({ config, models, sequelize }) => {
  const app = express();
  app.use(cors());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  const routeOverrides = getRouteOverrides();
  initRouters({ config, models, app, routeOverrides });
  await new Promise((resolve, reject) => app.listen(config.port, err => (err ? reject(err) : resolve(app))));
};

const init = async ({ config }) => {
  const { models, sequelize } = await initModels({ config });
  const app = await initApp({ config, models, sequelize });
};

init({ config });
