require('dotenv').config();

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
    if(!process.env.DEV_MODE || process.env.DEV_MODE === 'DISABLED')
    {

        if(password.length < 8)
        {
            return false;
        }

        return true;
    }
    
    return true;
}

const validateRole = (role) => {
    const rolesAllowed = [
        'root', 'admin', 'common-user'
    ];

    if(rolesAllowed.includes(role))
    {
        return true;
    }

    return false;
}

const validateParentId = (id) => {
    if (!Number.isInteger(id)){
        return false;
    }
    if(id < -1)
    {
        return false;
    }
    return true;
}

const validateSystemId = (systemId) => {
    if (!Number.isInteger(systemId)){
        return false;
    }
    if(systemId < -1)
    {
        return false;
    }
    return true;
}

const validator = {
    email: validateEmail,
    password: validatePassword,
    role: validateRole,
    parentId: validateParentId,
    systemId: validateSystemId
}

module.exports = validator