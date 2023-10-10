const Assignment = require('../Models/assignment');

exports.updateAssignmentById = async (req, res) => {
    try {
        // Extracting the ID from the request parameters
        const { id } = req.query;
        const usersId = req.user.id;

        // Validating the request body
        const { name, points, num_of_attempts, deadline } = req.body;
        console.log(deadline)

        if (!name && !points && !num_of_attempts && !deadline) {
            return res.status(400).json({ message: 'No fields to update were provided' });
        }

        console.log(id)

        // Finding the assignment to update
        const assignment = await Assignment.findOne({ where: { id } });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.userId !== usersId) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to update this assignment' });
        }

        // Updating the assignment
        if (name) assignment.name = name;
        if (points) assignment.points = points;
        if (num_of_attempts) assignment.num_of_attempts = num_of_attempts;
        if (deadline) assignment.deadline = deadline;

        await assignment.save();

        res.status(204).send();

        // Sending the updated assignment in the response
        // res.status(200).json({
        //     message: 'Assignment updated successfully',
        //     data: assignment
        // });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
