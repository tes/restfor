const { Op, QueryTypes } = require('sequelize');

//TODO exception handling ?

const createWhereFactory = (schema, typeName) => {
  const fieldNames = Object.keys(schema.fields);

  return filterStr => {
    const filter = filterStr ? JSON.parse(filterStr) : [];
    return {
      [Op.and]: filter.map(({ field, operator, value }) => {
        console.log(fieldNames);
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

const itemsFactory = (typeName, schema) => {
  const createWhere = createWhereFactory(schema, typeName);

  return async (_, { filter, sort, offset, limit }, { models }) => {
    if (offset) {
      offset = Math.max(0, offset);
    }

    const result = await models[typeName].findAll({
      where: createWhere(filter),
      limit,
      offset
      // sort,
    });

    return result;
  };
};

const itemFactory = typeName => (_, { id }, { models }) => models[typeName].findById(id);

const createFactory = typeName => (_, { new: record }, { models }) => models[typeName].create(record);

const updateFactory = (typeName, schema) => {
  return async (_, { id, delta }, { models }) => {
    const record = await models[typeName].findById(id);
    if (!record) {
      return null;
    }
    record.set(delta);
    return await record.save();
  };
};

const deleteFactory = (typeName, schema) => {
  return async (_, { ids }, { models }) => {
    const { sequelize, tableName } = models[typeName];
    if (!ids.length) return [];
    const foundIds = (await sequelize.query(`select id from ${tableName} where id in (:ids)`, {
      replacements: { ids },
      type: QueryTypes.SELECT
    })).map(({ id }) => id);
    //TODO affectedRows <> foundIds.length ?
    const affectedRows = await models[typeName].destroy({
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
