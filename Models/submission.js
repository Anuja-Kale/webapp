const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // make sure this path is correct
 
const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  assignment_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Assignments',
      key: 'id',
    },
    allowNull: false
  },
  submission_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  submission_updated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
 
});
 
Submission.associate = (models) => {
  Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id', as: 'assignment' });
};
 
console.log(Submission === sequelize.models.Submission);
 
module.exports = Submission;
