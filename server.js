// Import necessary modules and dependencies
const app = require('./app'); // Import the 'app' module
const sequelize = require('./Models/db'); // Import the Sequelize instance
const loadUsersFromCSV = require('./Utils/csvLoaders'); // Import a CSV loading utility
const processUsers = require('./Utils/processUsers'); // Import a utility to process users
const AWS = require('aws-sdk'); // Import the AWS SDK
const PORT = 8080; // Define the port number for the server to listen on

// Configure AWS CloudWatch
AWS.config.update({ region: 'us-east-1' });
const cloudwatch = new AWS.CloudWatch();

// CloudWatch functions to track API calls
function incrementCallCount(apiName) {
    const params = {
        MetricData: [
            {
                MetricName: 'API Calls',
                Dimensions: [
                    {
                        Name: 'APIName',
                        Value: apiName
                    },
                ],
                Unit: 'Count',
                Value: 1
            },
        ],
        Namespace: 'ExampleApp/ApiCalls'
    };

    cloudwatch.putMetricData(params, (err, data) => {
        if (err) console.log("Error putting metric data", err);
        else console.log("Metric data put success", data);
    });
}

// Middleware to track API calls
function apiCallTracker(req, res, next) {
    const apiName = req.baseUrl + req.path;
    incrementCallCount(apiName);
    next();
}

// Apply the middleware to all incoming requests
app.use(apiCallTracker);

// Define the association between User and Assignment models
const User = require('./Models/user'); // Import the User model
const Assignment = require('./Models/assignment'); // Import the Assignment model
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

