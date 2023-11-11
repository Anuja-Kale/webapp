const express = require('express');
const bodyParser = require('body-parser'); 
const { checkHealth, healthz } = require('./Controller/healthController');
const sequelize = require('./Models/db');
const loadUsersFromCSV = require('./Utils/csvLoaders');
const processUsers = require('./Utils/processUsers');
const Users = require('./Models/UserOLD');
const User = require('./Models/user');
const Assignment = require('./Models/assignment');
const basicAuth = require('./Middleware/basicAuth');  
const { createAssignment } = require('./Controller/assignmentController');
const { getAssignmentById } = require('./Controller/getAssignmentById');
const { getAllAssignments } = require('./Controller/getAllAssignments');
const { deleteAssignmentById } = require('./Controller/deleteAssignmentById');
const { updateAssignmentById } = require('./Controller/updateAssignmentById');
const logger = require('./Utils/logger');
const StatsDD = require('./Utils/StatsD_client');

const app = express();
const PORT = 8080;

app.use(bodyParser.json()); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


// Below API create the assignment
app.post('/api/assignment', basicAuth, createAssignment);
// app.get('/api/assignments', basicAuth,getAllAssignments);

//Below API Gets the assignment based on the ID or fecthes all the assignment
// Get a specific assignment by ID or all assignments if no ID is specified
app.get('/api/assignment/:id?', basicAuth, (req, res, next) => {
    if (req.params.id) {
        console.log('Getting assignment by Id');
        return getAssignmentById(req, res, next);
    }
    console.log('Getting all assignments');
    return getAllAssignments(req, res, next);
});


// Delete an assignment by ID
app.delete('/api/assignment/:id', basicAuth, (req, res, next) => {
    // Here, your deleteAssignmentById function should be ready to handle the route parameter
    // You should retrieve the ID with req.params.id in your controller
    return deleteAssignmentById(req, res, next);
});

// Update an assignment by ID
app.put('/api/assignment/:id', basicAuth, (req, res, next) => {
    // Here, your updateAssignmentById function should be ready to handle the route parameter
    // You should retrieve the ID with req.params.id in your controller
    return updateAssignmentById(req, res, next);
});


app.get('/healthz', async (req, res) => {
  try {
    StatsDD.increment('api.request.count');
    console.log('healthz')
    await sequelize.authenticate(); // Check the database connectivity
    logger.info("Connected to DB")
    res.status(200).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'ok' });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    logger.error("Connection error")
    res.status(503).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'error', message: 'Unable to connect to the database' });
  }
});

module.exports = app;







// Users.sync().then(result =>{
//   console.log(result)
// }).catch(error => {
//   console.error("Error syncing User Model with database:", error);
// });

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });
