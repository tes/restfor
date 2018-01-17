module.exports = ({ config, models }, router) => {
  router.get('/count', async (req, res) => {
    res.json({ count: await models.Task.count() });
  });
};
