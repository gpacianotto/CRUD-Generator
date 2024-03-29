const bcrypt = require('bcrypt');
const Accounts = require('../Models/account');
const User = require('../Models/user');
const SignUp = require('./signup');
const sha256 = require('js-sha256');
const loginValidator = require('../Helpers/Validators/login-validator');
const RequestService = require('../Singletons/RequestService');
const AccountSession = require('../Models/account-session');
const System = require('../Models/systems');

async function verifySession(account)
{
    let response;

    await AccountSession.findAll({where: {accountId: account.accountId}}).then((accounts) => {
        if(accounts.length >= 1)
        {
            response = accounts[0]
        }
        else{
            response = false
        }
        
    }).catch(() => {
        response = false;
    })

    return response;
}

async function getSystemByID(id)
{
    let response;
    
    await System.findAll({where: {systemId: id}}).then((systems) => {
        if(systems.length === 1)
        {
            response = systems[0];
        }
        else {
            response = false;
        }
    }).catch(() => {
        response = false;
    })

    return response;
}

async function registerSession(account)
{
    const isSession = await verifySession(account);
    const now = new Date();
    const nowStringed = now.toString();
    const hash = sha256.sha256(account.accountUid + nowStringed);
    const tomorrow = now;

    tomorrow.setDate(tomorrow.getDate() + 1);

    let response;

    if(!!isSession)
    {
        await AccountSession.update(
            {
                token: hash, 
                expiresIn: tomorrow.toString(),
                lastUsed: new Date().toString(),
            },
            
            {
                where: {
                    accountId: account.accountId
                }
            }
        ).then(async (res) => {

            const session = await verifySession(account);

            if(!!session)
            {
                response = session;
            }
            else {
                response = false;
            }
            

        }).catch((error) => {
            console.log(error);
            response = false;
        })
    }

    if(!isSession)
    {
        await AccountSession.create({
            accountId: account.accountId,
            token: hash,
            expiresIn: tomorrow.toString(),
            lastUsed: new Date().toString(),
        }).then((res) => {
            response = res;
        }).catch((error) => {
            console.log("error:", error);
            response = false;
        })
    }
    return response;
}

async function signIn(body, res) {
    
    const {email, password, systemId} = body;
    const service = RequestService.getInstance();
    let system = service.getCurrentSystem();
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
        console.log("system ID:",systemId);
        let account;
        if(!!systemId)
        {
            account = await SignUp.doesAccountExistInSystem(user, systemId);
            system = await getSystemByID(systemId);
            
        }
        else {
            account = await SignUp.doesAccountExistInSystem(user, system?.systemId);
        }

        //console.log("conta:",account);
        
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
        if(!!account)
        {
            const rightPassword = bcrypt.compareSync(password, account.passwordHash);
            
            if(!!rightPassword)
            {
                const sessionRegister = await registerSession(account);

                if(!!sessionRegister)
                {
                    res.json(
                        {
                        event: "success", 
                        code: "System and user",
                        data: {
                            system: system,
                            user: user,
                            account: account,
                            session: sessionRegister
                        } 
                        
                        }
                    )
                    return;
                }

                if(!sessionRegister)
                {
                    res.json(
                        {
                        event: "error", 
                        code: "Fatal Error", 
                        message: "There was an error while trying to register your session"
                        }
                    )
                    return;
                }
                
            }
            else{
                res.json(
                    {
                    event: "error", 
                    code: "Authentication Error", 
                    message: "Wrong Password"
                    }
                )
                return;
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
            return;
        }

        
    }



    return;

}

module.exports = signIn;