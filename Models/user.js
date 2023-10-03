const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
//const sequelize = require('./db');
const bcrypt = require('bcrypt')
const sequelize = require('./datab');

const User1 = sequelize.define('User', {
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
          // console.log(hashedPassword)
          this.setDataValue('password', hashedPassword);
        }
      },
      account_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      account_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }

}, {
  timestamps: false,
  });

  
  User1.associate = (models) => {
    User1.hasMany(models.Assignment, { foreignKey: 'userId', as: 'assignments' });
  };

  console.log(User1 === sequelize.models.User);

  module.exports = User1

