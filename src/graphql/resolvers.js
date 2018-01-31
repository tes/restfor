const { Op } = require('sequelize');

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

  return async (_, { filter, sort, offset, limit = pageLimitDefault }) => {
    if (offset) {
      offset = Math.max(0, offset);
    }
    if (limit) {
      limit = Math.min(pageLimitMax, Math.max(1, limit));
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

const createFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];

  return async (_, { new: record }) => {
    // console.log(record)
    return await Model.create(record);
  };
};

const updateFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];

  return async (_, { query, record }) => {
    // Model.findAll
    return null;
  };
};

const deleteFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];

  return (_, { ids }) => {
    // Model.findAll
    return null;
  };
};

module.exports = {
  itemsFactory,
  itemFactory,
  createFactory,
  updateFactory,
  deleteFactory
};
