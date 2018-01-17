const config = require('config');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { initModels } = require('./models');

const initApp = async ({ config, models }) => {
  const app = express();
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  await new Promise((resolve, reject) => app.listen(config.port, err => (err ? reject(err) : resolve(app))));
};

const init = async ({ config }) => {
  const models = await initModels({ config });
  const app = await initApp({ config, models });

  await models.Task.create({ title: 'elso' });
};

init({ config });
