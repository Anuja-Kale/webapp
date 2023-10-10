const application = require('./app');
const sequelize = require('./Models/datab');
const loadUsersFromCSV = require('./Utils/csvLoaders');
const processUsers = require('./Utils/processUsers');
const Users = require('./Models/user');
const Assignments = require('./Models/assignment');
const PORT = 8080;

loadUsersFromCSV('../opt/users.csv')
    .then(users => {
        return processUsers(users);
    })
    .then(() => {
        console.log("Finished processing users.");
        
        // Setup model relationships
        Users.hasMany(Assignments, { foreignKey: 'userId', as: 'assignments' });
        Assignments.belongsTo(Users, { foreignKey: 'userId', as: 'user' });

        // Sync models with database and start the server
        sequelize.sync().then(() => {
            application.listen(PORT, () => {
                console.log(`Server started on http://localhost:${PORT}`);
            });
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });
