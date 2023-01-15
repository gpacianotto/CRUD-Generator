const System = require("../Models/systems");
const listingRules = require("./listing-rules");

async function listSystems(req, res, next)
{
    const rules = listingRules;
    const perPage = rules.perPage;

    const page = req?.query?.page;

    const offset = (page - 1) * perPage;

    await System.findAndCountAll({limit: perPage, offset: offset}).then((result) => {
        res.json({
            event: "OK",
            response: result
        });
    }).catch((err) => {
        res.json({
            event: "error", 
            code: "Listing Error", 
            message: "Something went wrong while trying to list your systems",
            error: err
        });
    });

}

module.exports = listSystems;