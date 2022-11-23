const System = require('../Models/systems');

async function getSystemByToken(token)
{
    let response;

    System.findAll()
}

const authenticators = {
    getSystemByToken: getSystemByToken
}