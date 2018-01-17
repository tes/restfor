const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = async ({ config }) => {
  const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    dialect: 'mysql',
    host: config.db.host
  });

  const models = initDb(sequelize);
  associate(models);
  await sequelize.sync();

  return { models, sequelize };
};

const initDb = sequelize => {
  const basename = path.basename(__filename);
  return fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .map(file => sequelize.import(path.join(__dirname, file)))
    .reduce((db, model) => ({ ...db, [model.name]: model }), {});
};

const associate = db =>
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
  });
