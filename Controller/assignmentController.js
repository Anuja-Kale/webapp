// Importing necessary modules
const { Assignment } = require('../Models/assignment'); // Importing the Assignment model
const sequelize = require('../Models/db');               // Importing the Sequelize database connection
const logger = require('../Utils/logger');
// Exporting the createAssignment function
exports.createAssignment = async (req, res) => {
    try {
        // Destructuring the request body to get assignment details
        const {
            name, points, num_of_attempts, deadline
        } = req.body;

        // Getting the user ID from the request (assumed to be set by some authentication middleware)
        const userId = req.user.id;

        // Checking if all required fields are present in the request body
        // If any field is missing, respond with a 400 Bad Request error
        if (!name || !points || !num_of_attempts || !deadline) {
            logger.error("Invaild Input")
            return res.status(400).json({ message: 'Invalid input: All fields are required' });
        }

        // Check if user information is present in the request (for authorization purposes)
        // If the user ID is not present, respond with a 401 Unauthorized error
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Create a new assignment using Sequelize's create method
        const newAssignment = await sequelize.models.Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,
            userId
        });

        // Respond with a 201 Created status and the details of the newly created assignment
        res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });

    } catch (error) {
        // If any error occurs during the process, catch it and respond with a 500 Internal Server Error status
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
