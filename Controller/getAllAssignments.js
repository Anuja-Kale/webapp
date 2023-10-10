const  Assignment1  = require('../Models/assignment');
const User = require('../Models/user');  // Using the model file you've shared

exports.getAllAssignments = async (req, res) => {
    try {

        const usersId = req.user.id;
        const assignments = await Assignment1.findAll({
            // where: { userId: userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'first_name', 'last_name', 'email']
            }]
        });

        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: 'No assignments found' });
        }

        console.log(assignments)

        res.status(200).json({
            status: 'success',
            message: 'Assignments fetched successfully',
            data: assignments
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
