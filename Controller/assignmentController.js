const { Assignment } = require('../Models/assignment');
const sequelize = require('../Models/datab');

exports.createAssignment = async (req, res) => {
    try {
        const {
            name, points, num_of_attempts, deadline
        } = req.body;

        const usersId = req.user.id;

        // console.log(req.body)

        // 400 Bad Request for invalid input
        if (!name || !points || !num_of_attempts || !deadline) {
            return res.status(400).json({ message: 'Invalid input: All fields are required' });
        }

        // 401 Unauthorized if user id is not present
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // const userId = req.user.id;
        // console.log('In Create assignment')
        // console.log(req.body)
        // console.log('----')
        // console.log(userId)
        
        const newAssignment = await sequelize.models.Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,
            userId: usersId
        });

        res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
