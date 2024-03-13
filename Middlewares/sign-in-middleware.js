const System = require('../Models/systems');
const RequestService = require('../Singletons/RequestService');



async function verifySystemToken(token) {
    let response;

    await System.findAll({where: {systemToken: token}}).then((systems) => {
        if(systems.length === 1)
        {
            response = systems[0];
        }

        else
        {
            response = false;
        }
    }).catch(() => {
        response = false;
    })

    return response;

}
async function signInMiddleware(req, res, next) {   

    const header = req.headers;
    const systemToken = header?.systemtoken;
    const service = RequestService.getInstance();
    const body = req.body;
    

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

    if(!!systemToken)
    {
        const system = await verifySystemToken(systemToken)

        if(!system)
        {
            res.json(
                {
                event: "error", 
                code: "Authentication Error", 
                message: "Your token is not valid"
                }
            )
            return;
        }

        if(!!system)
        {
            service.setCurrentSystem(system);
            next();
            return;
        }
        
    }

    

}

module.exports = signInMiddleware