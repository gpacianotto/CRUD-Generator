const database = require('./Configs/db')
const User = require('./Models/user')
const System = require('./Models/systems');
const Account = require('./Models/account');
const AccountSession = require('./Models/account-session');
const MetaTables = require('./Models/meta-tables');
const MetaCollumns = require('./Models/meta-collumns');

async function sync()
{
    await database.sync().then((res) => {
        console.log("Database Synced successfully!")
    }).catch((err) => {
        console.log(err)
    });
}

module.exports = sync