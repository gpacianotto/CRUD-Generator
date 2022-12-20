const doesRootSystemExists = require('../Checkers/root-system-exists');
const Account = require('../Models/account');
const AccountSession = require('../Models/account-session');
const System = require('../Models/systems');
const User = require('../Models/user');
const RequestService = require('../Singletons/RequestService');
const requestService = RequestService.getInstance();

async function getSystemByToken(token)
{
    let response;

    await System.findAll({where: {systemToken: token}}).then((systems) => {
        
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

async function getUserAccountBySessionToken(token)
{
    let session;
    let account;
    let user;

    await AccountSession.findAll({where: {token: token}}).then((res) => {
        if(res.length === 1)
        {
            session = res[0];
        }
        else {
            session = false;
        }
    }).catch(() => {
        session = false;
    })

    if(!session)
    {
        return false;
    }

    await Account.findAll({where: {accountId: session.accountId}}).then((res) => {
        if(res.length === 1)
        {
            account = res[0];
        }
        else{
            account = false;
        }
    }).catch(() => {
        account = false;
    })

    if(!account)
    {
        return false;
    }

    await User.findAll({where: {userId: account.userId}}).then((users) => {
        if(users.length === 1)
        {
            user = users[0];
        }
        else{
            user = false;
        }
    }).catch(() => {
        user = false;
    })

    const completeUser = {
        user: user,
        account: account,
        session: session
    }
    return completeUser;
}   


async function authSystem(req, res, next) {
    const header = req.headers;
    const systemToken = header?.systemtoken;
    const rootSystemExistance = await requestService.verifyIfSystemRootExists();

    if(rootSystemExistance === 2)
    {
        next();
    }

    if(rootSystemExistance === 0)
    {
        res.json(
            {
            event: "error", 
            code: "Fatal Error", 
            message: "Could not verify your root system"
            }
        )
        return;
    }

    if(!systemToken)
    {
        res.json(
            {
            event: "error", 
            code: "Authentication Error", 
            message: "You system token was not sent on Headers"
            }
        )
        return;
    }

    const system = await getSystemByToken(systemToken);
    
    if(!system)
    {
        res.json(
            {
            event: "error", 
            code: "Authentication Error", 
            message: "Your token could not be authenticated"
            }
        );
        return false;
    }

    if(!!system)
    {
        requestService.setCurrentSystem(system);
        next();
    }
    return false;
}

async function authUser(req, res, next) {
    const header = req.headers;
    const token = header?.token;
    if(!token)
    {
        res.json(
            {
            event: "error", 
            code: "Authentication Error", 
            message: "You token was not sent on Headers"
            }
        )
        return;
    }

    const user = await getUserAccountBySessionToken(token);

    if(!!user.account && !!user.session && !!user.user)
    {
        const expiration = user.session.expiresIn;
        const expirationDate = new Date(expiration);
        const now = new Date();

        if(now > expirationDate)
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Your token has expired"
                }
            )
        }
        else {
            requestService.setCurrentUser(user.user);
            requestService.setCurrentAccount(user.account);
            requestService.setCurrentSession(user.session);
        
            next();
        }
       
    }
    else {
        if(!user.session)
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Could not find token session, please try again"
                }
            )
            return;
        }
        else {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Something went wrong while authenticating"
                }
            )
            return;
        }
    }

    

}

async function authRootUser(req, res, next)
{
    const header = req.headers;
    const token = header?.token;
    const rootSystemExistance = await requestService.verifyIfSystemRootExists();

    if(rootSystemExistance === 2)
    {
        next();
    }

    if(rootSystemExistance === 0)
    {
        res.json(
            {
            event: "error", 
            code: "Fatal Error", 
            message: "Could not verify your root system"
            }
        )
        return;
    }

    if(!token)
    {
        res.json(
            {
            event: "error", 
            code: "Authentication Error", 
            message: "You token was not sent on Headers"
            }
        )
        return;
    }

    const user = await getUserAccountBySessionToken(token);

    if(!!user.account && !!user.session && !!user.user)
    {
        const expiration = user.session.expiresIn;
        const expirationDate = new Date(expiration);
        const now = new Date();

        if(now > expirationDate)
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Your token has expired"
                }
            );
            return;
        }

        else if(user.account.role !== 'root')
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Your account exists, but it's not 'root'"
                }
            )
            return;
        }

        else {
            requestService.setCurrentUser(user.user);
            requestService.setCurrentAccount(user.account);
            requestService.setCurrentSession(user.session);
        
            next();
        }
    }

    else {
        if(!user.session)
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Could not find token session, please try again"
                }
            )
            return;
        }
        else {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Something went wrong while authenticating"
                }
            )
            return;
        }
    }

}

const authenticators = {
    getSystemByToken: getSystemByToken,
    authSystem: authSystem,
    authUser: authUser,
    authRootUser: authRootUser
}

module.exports = authenticators;