const Assignment = require('../Models/assignment');

exports.updateAssignmentById = async (req, res) => {
    try {
        // Extracting the ID from the request parameters
        const { id } = req.params;

        const userId = req.user.id;

        // Validating the request body
        const { name, points, num_of_attempts, deadline, ...extraFields } = req.body;

        // Check if there are any extra fields in the request body
        if (Object.keys(extraFields).length > 0) {
            return res.status(400).end(); // Return empty response without any content
        }

        if (!name && !points && !num_of_attempts && !deadline) {
            return res.status(400).end(); // Return empty response without any content
        }

        console.log(id)

        // Finding the assignment to update
        const assignment = await Assignment.findOne({ where: { id } });

        if (!assignment) {
            return res.status(404).end(); // Return empty response without any content
        }

        if (assignment.userId !== userId) {
            return res.status(403).end(); // Return empty response without any content
        }

        // Updating the assignment
        if (name) assignment.name = name;
        if (points) assignment.points = points;
        if (num_of_attempts) assignment.num_of_attempts = num_of_attempts;
        if (deadline) assignment.deadline = deadline;

        await assignment.save();

        res.status(204).end(); // Return empty response without any content
    } catch (error) {
        return res.status(500).end(); // Return empty response without any content
    }
};
