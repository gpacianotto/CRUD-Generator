const RequestService = require("../Singletons/RequestService");
const MetaTables = require("../Models/meta-tables");
const { doesTableExists, runSQL } = require("../Helpers/table-operations");
const MetaCollumns = require("../Models/meta-collumns");
const listingRules = require("../List/listing-rules");

async function doesMetaTableExist(id)
{
    let response = false;
    await MetaTables.findAll({include: [{model: MetaCollumns,as: 'collumns'}], where: {tableId: id}}).then((res) => {
        if(res.length === 1)
        {
            response = res[0];
        }
    }).catch((err) => {
        response = false
    })
    return response
}

async function list(req, res) {
    const tableId = req.params.tableId;

    const requestService = RequestService.getInstance();
    const system = requestService.getCurrentSystem();

    const rules = listingRules;
    const perPage = rules.perPage;

    const page = req?.query?.page;

    const offset = (page - 1) * perPage;

    const metaTable = await doesMetaTableExist(tableId);

    if(!metaTable)
    {
        res.json({
            event: "error",
            code: "Concistancy error",
            message: "This table doesn't exist in your system's metadata!",
        })
        return;
    }

    const doesTableExistInBD = await doesTableExists(metaTable.nameTable);

    if(!doesTableExistInBD)
    {
        res.json({
            event: "error",
            code: "Concistancy error",
            message: "This table doesn't exist in our database!",
        });
        return;
    }

    if(metaTable.systemId !== system.systemId)
    {
        res.json({
            event: "error",
            code: "Concistancy error",
            message: "You don't have access to this table!",
        });
        return;
    }

    let SQLString = "SELECT * FROM `" + metaTable.nameTable + "` LIMIT " + perPage + " OFFSET " + offset + ";" 
    
    const getRows = await runSQL(SQLString);

    if(getRows.event === "OK")
    {
        res.json({rows: getRows.data[0]});
        return;
    }
    res.json(getRows);

}

module.exports = list