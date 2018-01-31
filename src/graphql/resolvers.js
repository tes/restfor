const { Op } = require('sequelize')

const createWhereFactory = (schema) => {
  const fieldNames = Object.keys(schema)
  return predicates => {
    const where = {
      [Op.and]: predicates.map(({ field, operator, value }) => {
        if (!fieldNames.includes(field)) {
          throw new Error(`Predicate > unknown field > ${field}`)
        }
        if (!Op.hasOwnProperty(operator)) {
          throw new Error(`Predicate > unsupported operator > ${operator}`)
        }
        //TODO check type similarity
        //TODO type conversion ?
        return { [field]: { [Op[operator]]: value } }
      })
    }
  }
}


const itemsFactory = ({ models }, entityName, schema) => {
  const Model = models[entityName]
  const createWhere = createWhereFactory(schema)

  return async (_, { query, sort, offset, limit }) => {
    const result = await Model.findAll({
      where: createWhere(query)
      limit,
      offset,
      // sort, 
    })
    
    return result
  }
}

const itemFactory = ({ config, models }, entityName, schema) =>
  async (_, { id }) => {
    const result = Model.findById(id)
    return result
  }

const createFactory = ({ config, models }, entityName, schema) => {
  const Model = models[entityName]
  
  return async (_, { record }) => {
    return await Model.create(record)
  }
}

const updateFactory = ({ config, models }, entityName, schema) => {
  const Model = models[entityName]
  
  return async (_, { query, record }) => {
    // Model.findAll
    return null
  }
}

const deleteFactory = ({ config, models }, entityName, schema) => {
  const Model = models[entityName]
  
  return (_, { ids }) => {
    // Model.findAll
    return null
  }
}

module.exports = {
  itemsFactory,
  itemFactory,
  createFactory,
  updateFactory,
  defaultFactory
}
