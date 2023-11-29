const AWS = require('aws-sdk');

// Configure AWS to use promise
AWS.config.setPromisesDependency(Promise);

const sns = new AWS.SNS({
  region: 'us-east-1', // e.g., us-east-1
  // other configuration parameters
});

/**
 * Publishes a message to an SNS topic.
 * @param {string} message - The message to publish.
 * @param {string} TopicArn - The ARN of the SNS topic.
 * @returns {Promise<AWS.SNS.PublishResponse>}
 */
const publishToTopic = async (message, TopicArn) => {
  const params = {
    Message: message,
    TopicArn,
  };

  try {
    const publishTextPromise = await sns.publish(params).promise();
    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    console.log("MessageID is " + publishTextPromise.MessageId);
    return publishTextPromise;
  } catch (error) {
    console.error(`Error publishing to SNS topic: ${error.message}`);
    throw error;
  }
};

module.exports = {
  publishToTopic,
};
