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
const statsd = require('./Utils/StatsD_client');

const app = express();
const PORT = 8080;

app.use(bodyParser.json()); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Create an assignment
app.post('/api/assignment', basicAuth, async (req, res, next) => {
  statsd.increment('api.request.createAssignment');
  try {
    // Your logic to create an assignment...
    logger.info("Assignment created successfully");
    res.status(201).json({ message: 'Assignment created' });
  } catch (error) {
    console.error('Error creating assignment:', error);
    logger.error("Error creating assignment");
    res.status(500).json({ error: 'Error creating assignment' });
  }
});

// Get a specific assignment or all assignments
app.get('/api/assignment/:id?', basicAuth, async (req, res, next) => {
  statsd.increment('api.request.getAssignment');
  try {
    // Your logic to get assignment(s)...
    logger.info("Assignments retrieved successfully");
    res.status(200).json({ assignments: 'Your assignments data' });
  } catch (error) {
    console.error('Error getting assignments:', error);
    logger.error("Error getting assignments");
    res.status(500).json({ error: 'Error getting assignments' });
  }
});


// Delete an assignment
app.delete('/api/assignment/:id', basicAuth, async (req, res, next) => {
  statsd.increment('api.request.deleteAssignment');
  try {
    // Your logic to delete an assignment...
    logger.info("Assignment deleted successfully");
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting assignment:', error);
    logger.error("Error deleting assignment");
    res.status(500).json({ error: 'Error deleting assignment' });
  }
});

// Update an assignment
app.put('/api/assignment/:id', basicAuth, async (req, res, next) => {
  statsd.increment('api.request.updateAssignment');
  try {
    // Your logic to update an assignment...
    logger.info("Assignment updated successfully");
    res.status(200).json({ message: 'Assignment updated' });
  } catch (error) {
    console.error('Error updating assignment:', error);
    logger.error("Error updating assignment");
    res.status(500).json({ error: 'Error updating assignment' });
  }
});

app.get('/healthz', async (req, res) => {
  try {
    //await StatsD.increment('endpoint.hit.v1.healthZ.Check');

    try {
      statsd.increment('api.request.count');
    } catch (statsdError) {
      console.error('Error with StatsD:', statsdError);
    }
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
