const Op = Sequelize.Op;
const requestHandler = require('./requestHandler');

module.exports.find = name => ({ models }) =>
  requestHandler(({ offset, limit }) => models[name].findAll({ offset, limit }), req => req.query);

module.exports.findById = name => ({ models }) =>
  requestHandler(
    async ({ id }) => {
      const record = await models[name].findById(req.params.id);
      if (!record) throw new Error('Resource not found|404');
      return record;
    },
    req => ({ id: req.params.id })
  );

module.exports.bulkCreate = name => ({ models }) =>
  requestHandler(({ records }) => models[name].bulkCreate(records), req => ({ records: req.body }));

module.exports.updateById = name => ({ models }) =>
  requestHandler(
    ({ id, record }) => models[name].update(record, { where: { id } }),
    req => ({ id: Number(req.params.id), record: req.body })
  );

module.exports.bulkDelete = name => ({ models }) =>
  requestHandler(({ ids }) => models[name].destroy({ where: { id: { [Op.in]: ids } } }), req => ({ ids: req.body }));
