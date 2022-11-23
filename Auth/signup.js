const loginValidator = require('../Helpers/Validators/login-validator');
const User = require('../Models/user');
const Accounts = require('../Models/account');
const System = require('../Models/systems');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function doesAccountExistInSystem(user, systemId) 
{
    let response;

    console.log("user: ", user);

    await Accounts.findAll({where: {userId: user.userId, systemId: systemId}})
    .then((accounts) => {
        if(accounts.length > 0)
        {
            response = accounts[0];
        }
        else {
            response = false;
        }
    }).catch(error => {
        response = false;
    })

    return response;
}

async function doesUserExist(email)
{
    let response;
    await User.findAll({where: {email: email}}).then((user) => {
        if(user.length <= 0)
        {

            response =  false;
        }
        else{
            response =  user[0];
        }
        
    }).catch((err) => {
        response =  false;
    })
    return response;
}

async function isRootEmpty()
{
    let response;

    await Accounts.findAll({where: {role: 'root'}}).then((accounts) => {
        if(accounts.length >= 1)
        {
            response = false;
        }
        else {
            response = true;
        }
    }).catch((err) => {
        response = false;
    })

    return response;
}

async function doesSystemExist(id)
{
    let response;

    await System.findAll({where: {systemId: id}}).then((systems) => {
        if(systems.length === 1)
        {
            response = systems[0];
        }
        else response = false;
    }).catch(() => {
        response = false;
    })
    return response;
}

async function getRootSystem()
{
    let response;
    let rootSystemId = parseInt(process.env.ROOT_SYSTEM_ID);

    await System.findAll({where: {systemId: rootSystemId}}).then(systems => {
        if(systems.length === 1)
        {
            response = systems[0];
        }
        else {
            response = false;
        }
    })

    return response;
}

async function signUp(body, res) 
{

    const {email, password, role, systemId} = body;


    if(!loginValidator.email(email)){
        res.json(
            {
            event: "error", 
            code: "Validation Error", 
            message: "Email is not in a correct format"
            }
        )
        return;
    }
  
    if(!loginValidator.password(password))
    {
        res.json(
            {
            event: "error", 
            code: "Validation Error", 
            message: "Password must be at least 8 characters long"
            }
        )
        return;
    }
  
    if(!loginValidator.role(role))
    {
        res.json(
            {
            event: "error", 
            code: "Validation Error", 
            message: "User Roles allowed: 'root', 'admin', 'common-user'"
            }
        )
        return;
    }
    
    if(!loginValidator.systemId(systemId) && role != 'root')
    {
        res.json(
            {
            event: "error", 
            code: "Validation Error", 
            message: "Invalid System ID"
            }
        )
    }
    
    //if(role)

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT_HASH)));
    const existingUser = await doesUserExist(email);
    

    if(!!existingUser)
    {
        
        if(role === "root")
        {
            const empty = await isRootEmpty();
            const rootSystem = await getRootSystem(); 

            if(!!empty && !!rootSystem)
            {
                
                await Accounts.create({
                    systemId: parseInt(process.env.ROOT_SYSTEM_ID),
                    userId: existingUser.userId,
                    passwordHash: hashedPassword,
                    role: role,
                }).then((result) => {
                    
                    
                    
                    const accountResult = {
                        accountId: result.accountId,
                        systemId: result.systemId,
                        userId: result.userId,
                        role: result.role,
                        updatedAt: result.updatedAt,
                        createdAt: result.createdAt
                    }
                    res.json({
                        message: "Root Account Registered successfully",
                        account: accountResult,
                        system: rootSystem
                    })
                    
                }).catch((erro) => {
                    
                    res.json({
                        message: "There was an error while trying to create root user",
                        error: erro
                    })
                    
                })
                return;
            }
        }

        if(role === 'admin')
        {
            const system = await doesSystemExist();
            const account = await doesAccountExistInSystem(existingUser, systemId);
            
            if(!system)
            {
                res.json(
                    {
                    event: "error", 
                    code: "Consistancy Error", 
                    message: "This system does not exist in our database."
                    }
                )
                return;
            }


            if(!!account)
            {
                res.json(
                    {
                    event: "error", 
                    code: "Consistancy Error", 
                    message: "There's already an account with this email in this system!"
                    }
                )
                return;
            }

            
            if(!account && !!system)
            {
                await Accounts.create({
                    systemId: systemId,
                    userId: existingUser.userId,
                    passwordHash: hashedPassword,
                    role: role,
                }).then((account) => {
                    const accountResult = {
                        accountId: account.accountId,
                        systemId: account.systemId,
                        userId: account.userId,
                        role: account.role,
                        updatedAt: account.updatedAt,
                        createdAt: account.createdAt
                    }
                    res.json({
                        message: "Admin Account Registered Successfully",
                        account: accountResult,
                        system: system
                    })
                })
            }
        }

        res.json({message: "usuário já existente!"})
        return;
    }
    
    if(!existingUser)
    {
        await User.create({
            email: email
        }).then(async (response) => {

            const userCreated = response;
            
            
            if(role === "root")
            {
                const empty = await isRootEmpty();
                const rootSystem = await getRootSystem(); 

                if(!!empty && !!rootSystem)
                {
                    
                    await Accounts.create({
                        systemId: parseInt(process.env.ROOT_SYSTEM_ID),
                        userId: userCreated.userId,
                        passwordHash: hashedPassword,
                        role: role,
                    }).then((result) => {
                        
                        
                        
                        const accountResult = {
                            accountId: result.accountId,
                            systemId: result.systemId,
                            userId: result.userId,
                            role: result.role,
                            updatedAt: result.updatedAt,
                            createdAt: result.createdAt
                        }
                        res.json({
                            message: "Root Account Registered successfully",
                            account: accountResult,
                            system: rootSystem
                        })
                        
                    }).catch((erro) => {
                        
                        res.json({
                            message: "There was an error while trying to create root user",
                            error: erro
                        })
                        
                    })
                    return;
                }  

                if(!empty)
                {
                    res.json(
                        {
                        event: "error", 
                        code: "Consistancy Error", 
                        message: "We already have a root account registered! There could exist only one!"
                        }
                    )
                    return;
                }

                if(!rootSystem)
                {
                    res.json(
                        {
                        event: "error", 
                        code: "Consistancy Error", 
                        message: "There's no root system registered!"
                        }
                    )
                    return;
                }
                
                
                
            }

            if(role === "admin")
            {
                
            }
            
            // res.json({message: "Email Criado!", response: response})
            // return;
        }).catch((error) => {
            
            
            res.json({message: "An error occurred while trying to create an user", error: error});
            return;
        })
    }
      

    // res.json({message: "ok"})
          
}

const signUpFunctions = {
    signUp: signUp,
    doesUserExist: doesUserExist,
    doesAccountExistInSystem: doesAccountExistInSystem
};

module.exports = signUpFunctions;