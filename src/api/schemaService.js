const getSequelizeSchema = require('./sequelize/getJsonSchema');

module.exports = (sequelizeSchema, graphqlSchema) => {
  return (req, res) => {
    res.json(
      Object.keys(graphqlSchema).reduce(
        (schema, key) => ({ ...schema, [key.toLowerCase()]: graphqlSchema[key] }),
        Object.keys(sequelizeSchema).reduce(
          (schema, key) => ({ ...schema, [key.toLowerCase()]: sequelizeSchema[key] }),
          {}
        )
      )
    );
  };
};
