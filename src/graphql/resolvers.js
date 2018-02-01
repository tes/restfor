const { Op, QueryTypes } = require('sequelize');

//TODO exception handling ?

const createWhereFactory = (schema, typeName) => {
  const fieldNames = Object.keys(schema);

  return filterStr => {
    const filter = filterStr ? JSON.parse(filterStr) : [];
    return {
      [Op.and]: filter.map(({ field, operator, value }) => {
        console.log(fieldNames)
        if (!fieldNames.includes(field)) {
          throw new Error(`Predicate > unknown field "${field}" on type "${typeName}"`);
        }
        if (!Op.hasOwnProperty(operator)) {
          throw new Error(`Predicate > unsupported operator "${operator}"`);
        }
        //TODO check type similarity
        //TODO type conversion ?
        return { [field]: { [Op[operator]]: value } };
      })
    };
  };
};


const itemsFactory = ({ config: { pageLimitDefault, pageLimitMax = 100 } = {}, models }, typeName, schema) => {
  const Model = models[typeName];
  const createWhere = createWhereFactory(schema, typeName);

  return async (_, { filter, sort, offset, limit }) => {
    if (offset) {
      offset = Math.max(0, offset);
    }

    const result = await Model.findAll({
      where: createWhere(filter),
      limit,
      offset
      // sort,
    });

    return result;
  };
};

const itemFactory = ({ models }, typeName) => (_, { id }) => models[typeName].findById(id)

const createFactory = ({ models }, typeName) => (_, { new: record }) => models[typeName].create(record);

const updateFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];

  return async (_, { id, delta }) => {
    const record = await Model.findById(id)
    if (!record) {
      return null;
    }
    record.set(delta)
    return await record.save()
  };
};

const deleteFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];
  const { sequelize, tableName } = Model;

  return async (_, { ids }) => {
    if (!ids.length) return []
    const foundIds = (await sequelize.query(`select id from ${tableName} where id in (:ids)`,
        { replacements: { ids }, type: QueryTypes.SELECT })
      ).map(({ id }) => id);
    //TODO affectedRows <> foundIds.length ?
    const affectedRows = await Model.destroy({
      where: {
        id: { [Op.in]: foundIds }
      }
    });
    return foundIds;
  };
};

module.exports = {
  itemsFactory,
  itemFactory,
  createFactory,
  updateFactory,
  deleteFactory
};
