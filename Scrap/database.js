const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const express = require('express');

require('dotenv').config();

const app = express();

// mysql2 connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Sequelize configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: 3306,
});

sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

function checkHealth(req, res, next) {
  if (req.method !== 'GET') {
    res.status(405).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate;',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json();
    return;
  }
  next();
}

function healthz(req, res) {
  console.log(req.body);
  if (Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 0)) {
    res.status(400).json();
    return;
  }

  pool.query('SELECT 1', (err) => {
    if (err) {
      res.status(503).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate;',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json();
    } else {
      res.status(200).set({
        'Cache-Control': 'no-cache, no-store, must-revalidate;',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }).json();
    }
  });
}

module.exports = {
  checkHealth,
  healthz,
  sequelize  // exporting sequelize if you need it elsewhere
};
