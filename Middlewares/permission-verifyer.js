const RequestService = require("../Singletons/RequestService");

function permissionVerifier(req, res, next, permissions)
{
    // só se pode executar essa verificação após a autenticação

    const requestService = RequestService.getInstance();
    const account = requestService.getCurrentAccount();
    
    if(!account)
    {
        res.json({
            event: "error", 
            code: "Authentication Error", 
            message: "Your account is not authenticated",
        });
        return;
    }

    if(!!account)
    {

        if(permissions.includes(account.role))
        {
            next();
            return;
        }

        console.log(permissions);
        console.log(account.role);

        res.json({
            event: "error", 
            code: "Permission Error", 
            message: "Your account has no permission to do that",
        });
        return;
        
    }
}

module.exports = permissionVerifier;