const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' }); // replace YOUR_REGION with your region
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
 
const publish = async (message, subject, TopicArn) => {
  console.log(`Publishing message to SNS: ${message}`);
  console.log(`Message type: ${typeof message}`);
  console.log(`Subject: ${subject}`);
  console.log(`Subject type: ${typeof subject}`);
  console.log(`TopicArn: ${TopicArn}`);
  console.log(`TopicArn type: ${typeof TopicArn}`);
 
  const params = {
    Message: message,
    Subject: subject,
    TopicArn: TopicArn,
  };
 
  try {
    const publishTextPromise = await sns.publish(params).promise();
    console.log(`MessageID is ${publishTextPromise.MessageId}`);
    return publishTextPromise;
  } catch (err) {
    console.error(err, err.stack);
    throw err;
  }
};
 
module.exports = { publish };
