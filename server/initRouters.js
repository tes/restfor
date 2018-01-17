const express = require('express');
const { find, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = ({ config, models, app, routeOverrides }) =>
  Object.keys(models).map(initRouter({ config, models, app, routeOverrides }));

const initRouter = ({ config, models, app, routeOverrides }) => name => {
  const key = name.toLowerCase();
  const router = express.Router();

  const dependencies = { config, models };

  router.get('/', find(name)(dependencies));
  router.get('/:id', findById(name)(dependencies));
  router.post('/', bulkCreate(name)(dependencies));
  router.put('/:id', updateById(name)(dependencies));
  router.delete('/', bulkDelete(name)(dependencies));

  if (routeOverrides[key]) routeOverrides[key](dependencies, router);

  app.use(key, router);
};
