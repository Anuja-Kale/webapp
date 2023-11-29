const AWS = require('aws-sdk');
const Assignment = require('../Models/assignment');
// const Submission = require('../Models/submission'); // Ensure you have this model created
AWS.config.update({ region: 'us-east-1' }); // Update with your AWS region
const snsClient = new AWS.SNS();
const submission1 = require('../Models/submission');



const submitAssignment = async (req, res) => {
  try {
    //const assignmentId = req.params.assignmentId;
    const { submission_url } = req.body;
    const { id } = req.params;
    const { assignmentId } = id;
    const userId = req.user.id; // Assuming you have user info in the request after authentication

    console.log(id);

    // Fetch the assignment and check the deadline and retries
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (new Date() > new Date(assignment.deadline)) {
      return res.status(400).json({ error: 'Submission deadline has passed' });
    }

    // Fetch or create a submission record
    const [submission, created] = await submission1.findOrCreate({
      where: { assignment_id: id,submission_url: submission_url, },
      defaults: { attempts: 0 } // Default attempts to 0 if a new record is created
    });

    // Check if the user has already exceeded their retry limit
    if (submission.attempts >= assignment.retries) {
      return res.status(400).json({ error: 'Retry limit exceeded' });
    }

    // Increment attempts and save the submission
    submission.attempts += 1;
    await submission.save();

    // Publish to SNS topic
    const snsParams = {
      Message: JSON.stringify({
        userId: userId,
        assignmentId: assignmentId,
        submissionId: submission.id, // If you have an ID for the submission
        // Include any other relevant data you want to send to the SNS topic
      }),
      TopicArn: process.env.SNS_TOPIC_ARN // The ARN of your SNS topic
    };

    try {
      await snsClient.publish(snsParams).promise();
      console.log('Submission notification sent to SNS topic');
    } catch (snsError) {
      console.error('Error sending submission notification to SNS topic:', snsError);
      // Decide how you want to handle SNS errors, whether to inform the user or log it silently
    }

    // Respond to the user
    res.status(201).json({ message: 'Submission accepted', submission });

  } catch (error) {
    console.error('Error during submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitAssignment
};
