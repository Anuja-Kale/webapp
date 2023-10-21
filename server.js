// Import necessary modules and dependencies
const app = require('./app'); // Import the 'app' module
const sequelize = require('./Models/db'); // Import the Sequelize instance
const loadUsersFromCSV = require('./Utils/csvLoaders'); // Import a CSV loading utility
const processUsers = require('./Utils/processUsers'); // Import a utility to process users
const User = require('./Models/User'); // Import the User model
const Assignment = require('./Models/Assignment'); // Import the Assignment model
const PORT = 8080; // Define the port number for the server to listen on

// Define the association between User and Assignment models
User.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });
Assignment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Synchronize the Sequelize models with the database
sequelize.sync()
    .then(() => loadUsersFromCSV('../opt/users.csv')) // Load user data from a CSV file
    .then(users => processUsers(users)) // Process the loaded user data
    .then(() => {
        // When user processing is finished, start the server
        console.log("Finished processing users.");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        // Handle any errors that occur during the process
        console.error("Error:", err);
    });
