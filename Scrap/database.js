const mysql = require('mysql2');
const express = require('express');
// const bodyParser = require('body-parser'); // Import body-parser
require('dotenv').config();

const app = express();
// app.use(bodyParser.json());

const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: 'localhost',
//   user: 'root',
//   password: 'root123',
//   database: 'TestDataBase1'
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
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
//   if (Object.keys(req.query).length > 0) {
    // if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    console.log(req.body)
    if (Object.keys(req.query).length > 0 || ( req.body && Object.keys(req.body).length > 0))  {
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
  healthz
};
