module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    checked: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
  });

  return Task;
};
