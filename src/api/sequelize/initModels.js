const fs = require('fs-extra');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = async (dbConfig, modelsPath) => {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    dialect: 'mysql',
    host: dbConfig.host
  });

  const models = initDb(sequelize, modelsPath);
  associate(models);
  await sequelize.sync();

  return { models, sequelize };
};

const initDb = (sequelize, modelsPath) => {
  return fs
    .readdirSync(modelsPath)
    .map(file => sequelize.import(path.join(modelsPath, file)))
    .reduce((db, model) => ({ ...db, [model.name]: model }), {});
};

const associate = db =>
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
  });
