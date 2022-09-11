const database = require('./Configs/db')
const User = require('./Models/user')

async function sync()
{
    await database.sync();
}

module.exports = sync