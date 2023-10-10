

// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//     //   connectionLimit: 10,
//     //   host: 'localhost',
//     //   user: 'root',
//     //   password: 'root123',
//     //   database: 'TestDataBase1'
//         connectionLimit: 10,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     });
    
// pool.on('error', (err) => {
//       console.error('Database connection error:', err);
//     });
    
// module.exports = pool;

const Sequelize = require('sequelize'); 
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize