const { doesTableExists, runSQL } = require("../Helpers/table-operations");
const RequestService = require("../Singletons/RequestService");
const MetaTables = require("../Models/meta-tables");
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

async function deleteTable(req, res) {

    const tableId = req.params.tableId;

    const requestService = RequestService.getInstance();
    const system = requestService.getCurrentSystem();
    const usersSystem = requestService.getUsersSystem();

    console.log("userSystem: ", usersSystem);
    console.log("system: ", system);
    

    const metaTable = await doesMetaTableExist(tableId);
    console.log("metaTable: ", metaTable);

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

    if(metaTable.systemId !== usersSystem.systemId)
    {
        res.json({
            event: "error",
            code: "Concistancy error",
            message: "You don't have access to this table!",
        });
        return;
    }

    let SQLString = "DROP TABLE `" + metaTable.nameTable + "`;"

    const response = await runSQL(SQLString);

    if(response?.event === "OK")
    {
        await MetaCollumns.destroy({where: {tableId: metaTable.tableId}}).then(async (delCol) => {
            await MetaTables.destroy({where: {tableId: metaTable.tableId}}).then((delTab) => {
                res.json({
                    event: "OK",
                    databaseDeletion: response,
                    metaTableDeletion: delTab,
                    collumnDeletion: delCol
                });
                return;
            }).catch((e) => {
                res.json({
                    event: "error",
                    code: "Concistancy error",
                    message: "something wentWrong while trying to delete your collumns",
                    error: e
                });
            })
        }).catch((err) => {
            res.json({
                event: "error",
                code: "Concistancy error",
                message: "something wentWrong while trying to delete your table metadata.",
                error: err
            });
        })
    }

    res.json(response);
    

}

module.exports = deleteTable