const getSequelizeSchema = require('./sequelize/getJsonSchema');

module.exports = sequelizeSchema => {
  return (req, res) => {
    res.json(sequelizeSchema);
  };
};
