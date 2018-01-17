const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');

const SEQUELIZE = Symbol();
const SEQUELIZE_INSTANCE = Symbol();

module.exports.SEQUELIZE = SEQUELIZE;
module.exports.SEQUELIZE_INSTANCE = SEQUELIZE_INSTANCE;

module.exports.initModels = async ({ config }) => {
  const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    dialect: 'mysql',
    host: config.db.host
  });

  const basename = path.basename(__filename);

  const models = fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .map(file => sequelize.import(path.join(__dirname, file)))
    .reduce(
      (db, model) => {
        const nextDb = { ...db, [model.name]: model };
        if (nextDb[model.name].associate) nextDb[model.name].associate(nextDb);
        return nextDb;
      },
      { [SEQUELIZE_INSTANCE]: sequelize, [SEQUELIZE]: Sequelize }
    );

  await sequelize.sync();
  return models;
};
