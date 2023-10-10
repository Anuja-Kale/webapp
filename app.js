const express = require('express');
const bodyParser = require('body-parser'); 
const { checkHealth, healthz } = require('./Controller/healthController');
const sequelize = require('./Models/datab');
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


const app = express();
const PORT = 8080;

app.use(bodyParser.json()); 
// app.use(bodyParser.raw({ type: '*/*', limit: '10mb' }));

// app.all('/healthz', checkHealth);
// app.get('/healthz', healthz);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// app.get('/api/assignment',basicAuth,getAssignmentById)

// Below API create the assignment
app.post('/api/assignment', basicAuth, createAssignment);
// app.get('/api/assignments', basicAuth,getAllAssignments);

//Below API Gets the assignment based on the ID or fecthes all the assignment
app.get('/api/assignment', basicAuth, (req, res, next) => {
  if (req.query.id) {
      console.log('by Id')
      return getAssignmentById(req, res, next);
  }
  console.log('All Assignment')
  return getAllAssignments(req, res, next);
});

//Below API delete all the assignment
app.delete('/api/assignment', basicAuth, deleteAssignmentById);

//Below API update the assignment
app.put('/api/assignment', basicAuth, updateAssignmentById);

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

// loadUsersFromCSV('../opt/users.csv')
//     .then(users => {
//         return processUsers(users);
//     })
//     .then(() => {
//         console.log("Finished processing users.");
        
//         // Start the server after processing the users
//         // app.listen(PORT, () => {
//         //     console.log(`Server started on http://localhost:${PORT}`);
//         // });
//     })
//     .catch(err => {
//         console.error("Error:", err);
//     });



// User.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });
// Assignment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// sequelize.sync();





// Users.sync().then(result =>{
//   console.log(result)
// }).catch(error => {
//   console.error("Error syncing User Model with database:", error);
// });

// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });
