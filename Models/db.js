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
// require('dotenv').config(); // You can uncomment this if you're using dotenv for environment variables

const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, 
    {
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306,
    }
);

module.exports = sequelize;

