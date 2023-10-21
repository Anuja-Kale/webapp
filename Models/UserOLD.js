const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10); // hashing the password
        this.setDataValue('password', hashedPassword);
      }
    },
    account_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    account_updated: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      beforeUpdate: (user, options) => {
        user.account_updated = new Date();
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Assignment, { foreignKey: 'userId', as: 'assignments' });
  };

  return User;
};
