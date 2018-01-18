module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    checked: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    taskType: DataTypes.ENUM('primary', 'secondary'),
    deadline: DataTypes.DATE
  });

  Task.associate = ({ Task, User }) =>
    Task.belongsTo(User, {
      onDelete: 'CASCADE',
      foreignKey: { allowNull: false }
    });

  return Task;
};
