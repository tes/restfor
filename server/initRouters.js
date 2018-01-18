const express = require('express');
const getJsonSchema = require('./getJsonSchema');
const { find, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = ({ config, models, app, routeOverrides }) => {
  const modelNames = Object.keys(models);
  const resourceRouter = express.Router();
  modelNames.forEach(initRouter({ config, models }, resourceRouter, routeOverrides));
  app.use('/resources', resourceRouter);
  app.get('/schemas', (req, res) => {
    res.json(
      modelNames.reduce((schemas, name) => ({ ...schemas, [name]: getJsonSchema(models[name].attributes) }), {})
    );
  });
};

const initRouter = (dependencies, resourceRouter, routeOverrides) => name => {
  const key = name.toLowerCase();
  const overrideRouter = routeOverrides[key];
  const router = express.Router();

  router.get('/', find(name)(dependencies));
  router.get('/:id', findById(name)(dependencies));
  router.post('/', bulkCreate(name)(dependencies));
  router.put('/:id', updateById(name)(dependencies));
  router.delete('/', bulkDelete(name)(dependencies));

  if (overrideRouter) overrideRouter(dependencies, router);

  resourceRouter.use(`/${key}`, router);
};
