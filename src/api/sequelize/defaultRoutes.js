const Op = require('sequelize').Op;
const requestHandler = require('./requestHandler');
const { getSegmentFilter } = require('./queryCreator');

module.exports.findAll = name => ({ models }) => {
  const model = models[name];
  const defaultOrder = model.options.customOptions && model.options.customOptions.defaultOrder;
  return requestHandler(
    ({ offset, limit, segment }) => {
      const { where } = getSegmentFilter(segment, model);
      return model.findAndCount({ offset, limit, where, order: defaultOrder });
    },
    req => ({
      offset: req.query.offset ? Number(req.query.offset) : null,
      limit: req.query.limit ? Number(req.query.limit) : null,
      segment: req.query.segment
    })
  );
};

module.exports.findById = name => ({ models }) =>
  requestHandler(
    async ({ id }) => {
      const record = await models[name].findById(id);
      if (!record) throw new Error('Resource not found|404');
      return record;
    },
    req => ({ id: req.params.id })
  );

module.exports.bulkCreate = name => ({ models }) =>
  requestHandler(({ records }) => models[name].bulkCreate(records), req => ({ records: req.body }));

module.exports.updateById = name => ({ models }) =>
  requestHandler(
    ({ id, record }) => models[name].update(record, { where: { id } }).then(() => models[name].findById(id)),
    req => ({ id: Number(req.params.id), record: req.body })
  );

module.exports.bulkDelete = name => ({ models }) =>
  requestHandler(({ ids }) => models[name].destroy({ where: { id: { [Op.in]: ids } } }), req => ({ ids: req.body }));
