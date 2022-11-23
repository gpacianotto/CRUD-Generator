const bcrypt = require('bcrypt');
const Accounts = require('../Models/account');
const User = require('../Models/user');
const SignUp = require('./signup')
const loginValidator = require('../Helpers/Validators/login-validator');
const RequestService = require('../Singletons/RequestService');

async function signIn(body, res) {
    
    const {email, password} = body;
    const service = RequestService.getInstance();
    const system = service.getCurrentSystem();
    
    if(!loginValidator.email(email))
    {
        res.json(
            {
            event: "error", 
            code: "Validation Error", 
            message: "Email is not in a correct format"
            }
        )
        return;
    }
    if(!system)
    {
        res.json(
            {
            event: "error", 
            code: "Authentication Error", 
            message: "System not defined"
            }
        )
        return;
    }

    const user = await SignUp.doesUserExist(email);

    if(!user)
    {
        res.json(
            {
            event: "error", 
            code: "Context Error", 
            message: "User not found"
            }
        )
        return;
    }

    if(!!user)
    {
        const account = await SignUp.doesAccountExistInSystem(user, system.systemId);
        
        if(!!account)
        {
            const rightPassword = bcrypt.compareSync(password, account.passwordHash);
            
            if(!!rightPassword)
            {
                res.json(
                    {
                    event: "test", 
                    code: "System and user", 
                    system: system,
                    user: user,
                    account: account
                    }
                )
            }
            else{
                res.json(
                    {
                    event: "error", 
                    code: "Authentication Error", 
                    message: "Wrong Password"
                    }
                )
            }
            
             
        }

        if(!account)
        {
            res.json(
                {
                event: "error", 
                code: "Context Error", 
                message: "Account not found"
                }
            )
        }

        
    }



    return;

}

module.exports = signIn;