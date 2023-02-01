const System = require("../Models/systems");

async function doesRootSystemExists(req, res) {

    let response;
    let flagError;

    await System.findAll({where: {name: "root"}}).then((result) => {
        if(result.length === 1)
        {
            response = true;
        }

        else {
            response = false
        }
    }).catch((err) => {
        response = err;
        flagError = true;
    })

    if(!!flagError)
    {
        res.json(
            {
            event: "error", 
            code: "Internal Error", 
            message: "Something went wrong while trying to verify root system's existance",
            error: response
            }
        )
        return false;
    }

    if(!!response && !flagError)
    {
        res.json({
            doesRootExists: true
        });

        return true;
    }

    if(!response && !flagError)
    {
        res.json({
            doesRootExists: false
        });

        return false;
    }
    


    return response
}

module.exports = doesRootSystemExists;