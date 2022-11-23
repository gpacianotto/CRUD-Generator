const System = require('../Models/systems');

async function signUpMiddleware(req, res, next) {

    const header = req.headers;
    const systemToken = header?.systemtoken;
    const body = req.body;

    const {systemId, role} = body; 
 
    if(!systemToken && role !== 'root')
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
    if(!systemId && role !== 'root')
    {
        res.json(
            {
            event: "error", 
            code: "Consistancy Error", 
            message: "Your systemId was not sent in body"
            }
        )
        return;
    }

    if(!!systemToken && !!systemId && role !== 'root')
    {
        await System.findAll({where: {systemId: systemId, systemToken: systemToken}}).then((systems) => {
            if(systems.length > 1)
            {
                res.json(
                    {
                    event: "error", 
                    code: "Consistancy Error", 
                    message: "There are 2 systems with the same ID and Token, please contact the adminstrators"
                    }
                )
                return;
            }

            if(systems.length === 0)
            {
                res.json(
                    {
                    event: "error", 
                    code: "Authentication Error", 
                    message: "Your system could not be validated, verify your system token and try again"
                    }
                )
                return;
            }

            if(systems.length === 1)
            {
                console.log("system validated: ", systems[0])
                next();
            }
        }).catch((error) => {
            res.json(
                {
                event: "error", 
                code: "Unexpected error", 
                message: "There was an unexpected error while trying to validate your system",
                error: error
                }
            )
            return;
        })
    }

    
}

module.exports = signUpMiddleware;