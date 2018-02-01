const express = require('express');
const getRouteOverrides = require('./getRouteOverrides');
const { findAll, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');
const getJsonSchema = require('./getJsonSchema');

module.exports = (models, routesPath) => {
  const routeOverrides = getRouteOverrides(routesPath);
  const modelNames = Object.keys(models);
  const router = express.Router();
  modelNames.forEach(initRouter({ models }, router, routeOverrides));
  const schema = getJsonSchema(models);
  return { schema, router };
};

const initRouter = (dependencies, resourceRouter, routeOverrides) => name => {
  const key = name.toLowerCase();
  const overrideRouter = routeOverrides[key];
  const router = express.Router();

  if (overrideRouter) overrideRouter(dependencies, router);

  router.get('/', findAll(name)(dependencies));
  router.get('/:id', findById(name)(dependencies));
  router.post('/', bulkCreate(name)(dependencies));
  router.put('/:id', updateById(name)(dependencies));
  router.delete('/', bulkDelete(name)(dependencies));

  resourceRouter.use(`/${key}`, router);
};
