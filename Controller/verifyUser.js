// Somewhere in your controllers directory

const fs = require('fs').promises;
const path = require('path');
const csvParser = require('papaparse');
const { User } = require('../Models/user');
const sequelize = require('../Models/db');
const User1 = sequelize.models.User;
const bcrypt = require('bcrypt');

const verifyUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    console.log(req.body)
    // const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        console.log("Intry")
        const existingUser = await User1.findOne({ where: { email } });
        console.log(existingUser)

        if (existingUser) {
            // return res.status(404).json({ message: 'User not found' });
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (isPasswordValid) {
                // Password is valid, return success response
                return res.status(200).json({ message: 'User verified successfully' });
            } else {
                // Password is invalid, return unauthorized response
                return res.status(401).json({ message: 'Incorrect password' });
            }
        }else{
            
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("In else bloack")
            console.log(req.body)
   
           // If not, append to user.csv
           const csvLine = `"${first_name}","${last_name}","${email}","${hashedPassword}"\n`;
           await fs.appendFile(path.join(__dirname, '../opt/users.csv'), csvLine);
   
           // Add to database
           await User1.create({
               first_name,
               last_name,
               email,
               password
           });
   
           return res.status(201).json({ message: 'User created' });

        }
       
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = verifyUser;
