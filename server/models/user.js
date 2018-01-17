module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING
  });

  User.associate = ({ User, Task }) => User.hasMany(Task);

  return User;
};
