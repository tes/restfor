const express = require('express');
const { find, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = ({ config, models, app, routeOverrides }) => {
  const modelNames = Object.keys(models);
  const resourceRouter = express.Router();
  modelNames.forEach(initRouter({ config, models, resourceRouter, routeOverrides }));
  app.use('/resources', resourceRouter);
  app.get('/entities', (req, res) => res.json(modelNames));
};

const initRouter = ({ config, models, resourceRouter, routeOverrides }) => name => {
  const key = name.toLowerCase();
  const router = express.Router();

  const dependencies = { config, models };

  router.get('/', find(name)(dependencies));
  router.get('/:id', findById(name)(dependencies));
  router.post('/', bulkCreate(name)(dependencies));
  router.put('/:id', updateById(name)(dependencies));
  router.delete('/', bulkDelete(name)(dependencies));

  if (routeOverrides[key]) routeOverrides[key](dependencies, router);

  resourceRouter.use(`/${key}`, router);
};
