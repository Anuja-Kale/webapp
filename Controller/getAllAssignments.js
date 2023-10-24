// Import necessary modules and models
const Assignment1 = require('../Models/assignment'); // Import the Assignment model
const User = require('../Models/user'); // Import the User model (assuming it's the one shared with you)

// Define a function to get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        // Extract the user ID from the request
        const userId = req.user.id;

        // Fetch all assignments associated with the user
        const assignments = await Assignment1.findAll({
            // where: { userId: userId }, // You can uncomment this line to filter assignments by user ID if needed
            include: [{
                model: User, // Include the User model to get user information
                as: 'user', // Alias for the User model
                attributes: ['id', 'first_name', 'last_name', 'email'] // Specify which user attributes to include
            }]
        });

        // If no assignments are found, return a 404 Not Found response
        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found' });
        }

        // Log the fetched assignments for debugging purposes
        console.log(assignments);

        // Return a 200 OK response with the fetched assignments
        res.status(200).json({
            status: 'success',
            message: 'Assignments fetched successfully',
            data: assignments
        });
    } catch (error) {
        // Handle any errors that occur during the process and return a 500 Internal Server Error response
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
