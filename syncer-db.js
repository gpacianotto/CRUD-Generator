const database = require('./Configs/db')
const User = require('./Models/user')
const System = require('./Models/systems');
const Account = require('./Models/account');

async function sync()
{
    await database.sync().then((res) => {
        console.log("Database Synced successfully!")
    }).catch((err) => {
        console.log(err)
    });
}

module.exports = sync