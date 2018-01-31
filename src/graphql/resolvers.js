const { Op } = require('sequelize');

const createWhereFactory = schema => {
  const fieldNames = Object.keys(schema);
  return predicates => {
    const where = {
      [Op.and]: predicates.map(({ field, operator, value }) => {
        if (!fieldNames.includes(field)) {
          throw new Error(`Predicate > unknown field > ${field}`);
        }
        if (!Op.hasOwnProperty(operator)) {
          throw new Error(`Predicate > unsupported operator > ${operator}`);
        }
        //TODO check type similarity
        //TODO type conversion ?
        return { [field]: { [Op[operator]]: value } };
      })
    };
  };
};

const itemsFactory = ({ models }, typeName, schema) => {
  const Model = models[typeName];
  const createWhere = createWhereFactory(schema);

  return async (_, { filter: filterStr, sort, offset, limit }) => {
    const filter = filterStr ? JSON.parse(filterStr) : [];
    const result = await Model.findAll({
      where: createWhere(filter),
      limit,
      offset
      // sort,
    });

    return result;
  };
};

const itemFactory = ({ config, models }, typeName, schema) => async (_, { id }) => {
  const Model = models[typeName];
  const result = Model.findById(id);
  return result;
};

const createFactory = ({ config, models }, typeName, schema) => {
  const Model = models[typeName];

  return async (_, { record }) => {
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
