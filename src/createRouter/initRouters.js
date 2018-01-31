const express = require('express');
const getJsonSchema = require('./getJsonSchema');
const getRouteOverrides = require('./getRouteOverrides');
const { findAll, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = (models, routesPath, router) => {
  const routeOverrides = getRouteOverrides(routesPath);
  const modelNames = Object.keys(models);
  const resourceRouter = express.Router();
  modelNames.forEach(initRouter({ models }, resourceRouter, routeOverrides));
  router.use('/resources', resourceRouter);
  router.get('/schemas', (req, res) => {
    res.json(
      modelNames.reduce(
        (schemas, name) => ({ ...schemas, [name.toLowerCase()]: getJsonSchema(models[name].attributes) }),
        {}
      )
    );
  });
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
