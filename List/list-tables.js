const MetaCollumns = require("../Models/meta-collumns");
const MetaTables = require("../Models/meta-tables");
const RequestService = require("../Singletons/RequestService")
const listingRules = require("./listing-rules");

async function listTables(req, res) {

    const requestService = RequestService.getInstance();
    const system = requestService.getUsersSystem();

    const rules = listingRules;
    const perPage = rules.perPage;

    const page = req?.query?.page;

    const offset = (page - 1) * perPage;

    
    
    if(!!system)
    {
        await MetaTables.findAndCountAll(
            {
                limit: perPage, 
                offset: offset, 
                where: {
                    systemId: system.systemId
                },
                include: [{
                    model: MetaCollumns,
                    as: 'collumns'
                }]
            }
            ).then((tables) => {
            res.json({
                event: "OK",
                response: tables,
                system: system
            });
            return;
        }).catch((error) => {
            res.json({
                event: "error",
                code: "Erro!",
                message: "Houve algum erro",
                erro: error
            })
            return;
        })
    }

}

module.exports = listTables