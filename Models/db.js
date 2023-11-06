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


//const Sequelize = require('sequelize');
// require('dotenv').config(); // You can uncomment this if you're using dotenv for environment variables

const Sequelize = require('sequelize');
// require('dotenv').config(); // If you're using dotenv, you can uncomment this line
if (process.env.NODE_ENV !== 'envProd') {
    require('dotenv').config();
}

// const DB_DATABASE = "csye6225";
// const DB_USERNAME = "csye6225";
// const DB_PASSWORD = "J8adestroyvQr#9zL4y";
// const DB_HOST = "csye6225-dbfcec3f7.cnrttrsz0ctr.us-east-1.rds.amazonaws.com";

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306,
});

module.exports = sequelize;