const express = require('express');
const { find, findById, bulkCreate, updateById, bulkDelete } = require('./defaultRoutes');

module.exports = ({ config, models, app, routeOverrides }) => {
  const modelNames = Object.keys(models);
  modelNames.map(initRouter({ config, models, app, routeOverrides }));
  app.get('/entities', (req, res) => res.json(modelNames));
};

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

  app.use(`/resources/${key}`, router);
};
