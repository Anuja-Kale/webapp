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
const { submitAssignment } = require('./Controller/submissionController');
const logger = require('./Utils/logger');
const statsd = require('./Utils/StatsD_client');
//const { publishToSNS } = require('./Utils/snsPublish.js');

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

// Add the POST route for submission
app.post('/api/assignment/:id/submission', basicAuth, submitAssignment);


app.get('/healthz', async (req, res) => {
  try {
    console.log('healthz')
    await sequelize.authenticate(); // Check the database connectivity
    
    res.status(200).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'ok' });

  } catch (error) {
    console.error('Unable to connect to the database:', error);

    res.status(503).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'error', message: 'Unable to connect to the database' });
  }
});

module.exports = app;





// // Create an assignment
// app.post('/api/assignment', basicAuth, async (req, res, next) => {
//   statsd.increment('api.request.createAssignment');
//   try {
//     // Your logic to create an assignment...
//     logger.info("Assignment created successfully");
//     await createAssignment.createAssignment(req, res);
//     res.status(201).json({ message: 'Assignment created' });
//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     logger.error("Error creating assignment");
//     res.status(500).json({ error: 'Error creating assignment' });
//   }
// });

// app.get('/api/assignment', basicAuth, async (req, res) => {
//   try {
//     // Assuming you have a findAll method on your Assignment model
//     const assignments = await Assignment.findAll();
//     logger.info("Assignments retrieved successfully");
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error('Error getting assignments:', error);
//     logger.error("Error getting assignments");
//     res.status(500).json({ error: 'Error getting assignments' });
//   }
// });

// app.get('/api/assignment/:id', basicAuth, async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     // Assuming you have a findByPk or similar method on your Assignment model
//     const assignment = await Assignment.findByPk(id);
//     if (!assignment) {
//       logger.info("Assignment not found");
//       return res.status(404).json({ error: 'Assignment not found' });
//     }

//     logger.info("Assignment retrieved successfully");
//     res.status(200).json(assignment);
//   } catch (error) {
//     console.error('Error getting the assignment:', error);
//     logger.error("Error getting the assignment");
//     res.status(500).json({ error: 'Error getting the assignment' });
//   }
// });


// // Delete an assignment
// app.delete('/api/assignment/:id', basicAuth, async (req, res, next) => {
//   statsd.increment('api.request.deleteAssignment');
//   try {
//     // Your logic to delete an assignment...
//     logger.info("Assignment deleted successfully");
//     return res.status(204).send(); // No content to send back for a delete operation
//   } catch (error) {
//     console.error('Error deleting assignment:', error);
//     logger.error("Error deleting assignment");
//     return res.status(500).json({ error: 'Error deleting assignment' });
//   }
// });


// // Update an assignment
// app.put('/api/assignment/:id', basicAuth, async (req, res, next) => {
//   statsd.increment('api.request.updateAssignment');
//   try {
//     // Your logic to update an assignment...
//     logger.info("Assignment updated successfully");
//     return res.status(200).json({ message: 'Assignment updated' });
//   } catch (error) {
//     console.error('Error updating assignment:', error);
//     logger.error("Error updating assignment");
//     return res.status(500).json({ error: 'Error updating assignment' });
//   }
// });

// // POST request for submission
// app.post('/api/assignment/:id/submit', basicAuth, async (req, res) => {
//   const { id } = req.params; // Assignment ID
//   const user = req.user; // Assuming you have the user from basicAuth middleware
//   const submissionData = req.body; // Data for the submission

//   try {
//     const assignment = await Assignment.findByPk(id);

//     // Check if assignment exists
//     if (!assignment) {
//       return res.status(404).json({ error: 'Assignment not found' });
//     }

//     // Check if deadline has passed
//     if (new Date() > new Date(assignment.deadline)) {
//       return res.status(403).json({ error: 'Deadline for this assignment has passed' });
//     }

//     // Check if user has retries left
//     const submissionsCount = await Submission.count({ where: { UserId: user.id, AssignmentId: id } });
    
//     if (submissionsCount >= assignment.attemptLimit) {
//       return res.status(403).json({ error: 'Retry limit exceeded' });
//     }

//     // Create submission
//     const submission = await Submission.create({
//       // ...submission data...
//       AssignmentId: id,
//       UserId: user.id,
//       submissionLink: submissionData.submissionLink // Assuming this is part of the submission data
//     });

//     // Publish submission URL to SNS topic
//     await publishToSNS(assignment.snsTopicArn, {
//       submissionLink: submission.submissionLink,
//       userEmail: user.email
//     });

//     res.status(201).json({ message: 'Submission successful' });
//   } catch (error) {
//     console.error('Error handling submission:', error);
//     res.status(500).json({ error: 'Error handling submission' });
//   }
// });


// app.get('/healthz', async (req, res) => {
//   try {
//     //await StatsD.increment('endpoint.hit.v1.healthZ.Check');

//     try {
//       statsd.increment('api.request.count');
//     } catch (statsdError) {
//       console.error('Error with StatsD:', statsdError);
//     }
//     console.log('healthz')
//     await sequelize.authenticate(); // Check the database connectivity
//     logger.info("Connected to DB")
//     res.status(200).set({
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//       'X-Content-Type-Options': 'nosniff'
//     }).json({ status: 'ok' });

//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     logger.error("Connection error")
//     res.status(503).set({
//       'Cache-Control': 'no-cache, no-store, must-revalidate',
//       'Pragma': 'no-cache',
//       'X-Content-Type-Options': 'nosniff'
//     }).json({ status: 'error', message: 'Unable to connect to the database' });
    
//   }
// });

// module.exports = app;







// Users.sync().then(result =>{
//   console.log(result)
// }).catch(error => {
//   console.error("Error syncing User Model with database:", error);
// });

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });
