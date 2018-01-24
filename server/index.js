const config = require('config');
const express = require('express');
const restfor = require('./init');
const { join } = require('path');

restfor({
  db: config.db,
  modelsPath: join(__dirname, 'models'),
  routesPath: join(__dirname, 'routes')
}).then(router => {
  const app = express();
  app.use('/api', router);
  app.listen(config.port);
});
