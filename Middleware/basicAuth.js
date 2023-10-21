const { User } = require('../Models/user');
const bcrypt = require('bcryptjs');
const sequelize = require('../Models/db');
const User1 = sequelize.models.User;

// Define a middleware for basic authentication
const basicAuth = async (req, res, next) => {
    try {
        // Check if the request includes the 'Authorization' header with 'Basic' prefix
        if (req.headers.authorization && req.headers.authorization.startsWith('Basic')) {
            // Extract and decode the base64-encoded credentials from the header
            const base64Credentials = req.headers.authorization.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [email, password] = credentials.split(':');

            // Find a user with the provided email using Sequelize
            const user = await sequelize.models.User.findOne({ where: { email } });

            // If no user is found, return a 401 Unauthorized response
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // Hash the provided password and compare it with the stored hashed password
            const isValidPassword = await bcrypt.compare(password, user.password);

            // If the password is not valid, return a 401 Unauthorized response
            if (!isValidPassword) {
                console.log('Please give correct Credentials');
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // If authentication is successful, attach the user object to the request
            req.user = user;
            next();
        } else {
            // If the 'Authorization' header is missing, return a 401 Unauthorized response
            res.status(401).json({ message: 'Authentication header missing' });
        }
    } catch (error) {
        // Handle any errors that occur during the authentication process and return a 500 Internal Server Error response
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};

// Export the basic authentication middleware for use in other modules
module.exports = basicAuth;