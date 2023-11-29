const Assignment = require('../Models/assignment');
// const Submission = require('../Models/submission'); // Ensure you have this model created

// Handles the submission of an assignment
const submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const userId = req.user.id; // Assuming you have user info in the request after authentication

    // Fetch the assignment and check the deadline and retries
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (new Date() > new Date(assignment.deadline)) {
      return res.status(400).json({ error: 'Submission deadline has passed' });
    }

    // Fetch or create a submission record
    const [submission, created] = await Submission.findOrCreate({
      where: { userId, assignmentId },
      defaults: { attempts: 0 } // Default attempts to 0 if a new record is created
    });

    // Check if the user has already exceeded their retry limit
    if (submission.attempts >= assignment.retries) {
      return res.status(400).json({ error: 'Retry limit exceeded' });
    }

    // Increment attempts and save the submission
    submission.attempts += 1;
    await submission.save();

    // TODO: Process the actual submission content here if necessary

    res.status(201).json({ message: 'Submission accepted', submission });
  } catch (error) {
    console.error('Error during submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitAssignment
};
