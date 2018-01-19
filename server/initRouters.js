const express = require('express');
const getJsonSchema = require('./getJsonSchema');
const { findAll, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = ({ config, models, app, routeOverrides }) => {
  const modelNames = Object.keys(models);
  const apiRouter = express.Router();
  const resourceRouter = express.Router();
  modelNames.forEach(initRouter({ config, models }, resourceRouter, routeOverrides));
  apiRouter.use('/resources', resourceRouter);
  apiRouter.get('/schemas', (req, res) => {
    res.json(
      modelNames.reduce(
        (schemas, name) => ({ ...schemas, [name.toLowerCase()]: getJsonSchema(models[name].attributes) }),
        {}
      )
    );
  });
  app.use('/api', apiRouter);
};

const initRouter = (dependencies, resourceRouter, routeOverrides) => name => {
  const key = name.toLowerCase();
  const overrideRouter = routeOverrides[key];
  const router = express.Router();

  router.get('/', findAll(name)(dependencies));
  router.get('/:id', findById(name)(dependencies));
  router.post('/', bulkCreate(name)(dependencies));
  router.put('/:id', updateById(name)(dependencies));
  router.delete('/', bulkDelete(name)(dependencies));

  if (overrideRouter) overrideRouter(dependencies, router);

  resourceRouter.use(`/${key}`, router);
};
