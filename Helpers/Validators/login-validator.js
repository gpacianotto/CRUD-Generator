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

const validator = {
    email: validateEmail,
    password: validatePassword
}

module.exports = validator