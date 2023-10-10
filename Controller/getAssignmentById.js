const  Assignment1  = require('../Models/assignment');
const Users = require('../Models/user');  // Using the model file you've shared
const sequelize = require('../Models/datab');

exports.getAssignmentById = async (req, res) => {
    try {
        const { id } = req.query;
        const userId = req.user.id;
        console.log(id)
    
        const attributes = Assignment1.rawAttributes;
        const fields = Object.keys(attributes);
        console.log(fields);
        // console.log('Hello')

        const assignment1 = await Assignment1.findOne({where: { id }, 
        // const assg = await Assignment1.findOne({where: { id: id,userId: userId}, 
        include: [{
                model: Users,
                as: 'user', // This should match the alias in your associations
                attributes: ['id', 'first_name', 'last_name', 'email'] // Choose the user attributes you want to fetch
            }]
        })

        // console.log('hello')
        console.log(assignment1)
            
        // Check if assignment exists
        if (!assignment1) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        

        // Structure the response with assignment and user details
        const responseDetails = {
            status: 'success',
            message: 'Assignment fetched successfully',
            data: {
                id: assignment1.id,
                name: assignment1.name,
                points: assignment1.points,
                numOfAttempts: assignment1.num_of_attempts,
                deadline: assignment1.deadline,
                assignmentCreated: assignment1.assignment_created,
                assignmentUpdated: assignment1.assignment_updated,
                userId: assignment1.userId,
                useremail: assignment1.user.email,
                userFName: assignment1.user.first_name,
                userLName: assignment1.user.last_name // This will have the associated user details
            }
        };

        console.log(responseDetails)

        // Return the structured response
        res.status(200).json(responseDetails);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
