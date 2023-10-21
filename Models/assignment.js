const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10
    }
  },
  num_of_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  assignment_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  assignment_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }

}, {
  timestamps: false,
  // Other model options go here
  });

  
  Assignment.associate = (models) => {
    Assignment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };


  console.log(Assignment === sequelize.models.Assignment);

  module.exports = Assignment

