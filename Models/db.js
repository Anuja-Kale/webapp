// const Sequelize = require('sequelize'); 
require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
//     dialect: 'mysql',
//     host:'localhost',
//     port: 3306
// });

// module.exports = suelizeeq

// const sequelize = new Sequelize(
//     process.env.DB_DATABASE, 
//     process.env.DB_USERNAME, 
//     process.env.DB_PASSWORD, 
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//         port: 3306,
//     }
// );
// module.exports = sequelize

const Sequelize = require('sequelize');

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'envProd') {
    require('dotenv').config();
}

// Logging the environment variables (for development purposes only, not safe in production for sensitive data)
console.log("---------")
console.log(process.env.NODE_ENV);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.awsAccessKeyId);
console.log("---------")

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306,
});

// Testing the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;