const Assignment = require('../Models/Assignment');

exports.deleteAssignmentById = async (req, res) => {
    try {
        // Retrieve ID from the request parameters
        const { id } = req.params;


         // Assuming req.user.id holds the authenticated user's ID
         const userId = req.user.id;

         // Retrieve the assignment to check the associated user
         const assignment = await Assignment.findOne({
             where: { id: id }
         });
 
         // Check if assignment exists
         if (!assignment) {
             return res.status(404).json({ message: 'Assignment not found' });
         }
 
         // Check if user is authorized to delete the assignment
         if (assignment.userId !== userId) {
             return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this assignment' });
         }
         
        // Attempt to delete the assignment with the given ID
        const deletedRowCount = await Assignment.destroy({
            where: { id: id }
        });

        // Check if any rows were deleted
        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // res.status(200).json({ message: 'Assignment deleted successfully' });
        res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
