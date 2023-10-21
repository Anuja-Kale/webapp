// const { User1 } = require('../Models/UserOLD');  // Adjust the path based on your directory structure
const bcrypt = require('bcrypt');
const sequelize = require('../Models/db');
const User1 = sequelize.models.User;

const processUsers = async (users) => {

    console.log('In Process Users')
    console.log(users)
    for (let userEntry  of users) {

        let userData = userEntry ['first_name,last_name,email,password'].split(',');
        let user = {
            first_name: userData[0],
            last_name: userData[1],
            email: userData[2],
            password: userData[3]
        };
        console.log(user.email)
        console.log(user.password)
       

        const attributes = sequelize.models.User.rawAttributes;
        const fields = Object.keys(attributes);
        console.log(fields);
    
        const existingUser = await  sequelize.models.User.findOne({ where: { email: user.email } });

        if (!existingUser) {
            await sequelize.models.User.create(user);
        }
    }
};

module.exports = processUsers;


