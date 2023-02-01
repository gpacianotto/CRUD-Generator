const RequestService = require("../Singletons/RequestService");
const MetaTables = require("../Models/meta-tables");
const { doesTableExists, runSQL } = require("../Helpers/table-operations");
const MetaCollumns = require("../Models/meta-collumns");

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

async function destroy(req, res) {
    const tableId = req.params.tableId;

    const pk = req?.query?.pk;

    const requestService = RequestService.getInstance();
    const system = requestService.getCurrentSystem();

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

    const collumns = metaTable.collumns;
    let primaryKey;

    collumns.map((col) => {
        if(!!col.optionPrimaryKey)
        {
            primaryKey = col;
        }
    })

    let SQLString = "DELETE FROM `" + metaTable.nameTable + "` WHERE " + primaryKey.nameCollumn + " = " + pk;

    const getRow = await runSQL(SQLString);

    if(getRow.event === "OK")
    {
        res.json({deleted: getRow});
        return;
    }
    
    res.json(getRow);

}

module.exports = destroy