const { doesTableExists, createTable, deleteTable } = require("../Helpers/table-operations");
const MetaCollumns = require("../Models/meta-collumns");
const MetaTables = require("../Models/meta-tables");
const RequestService = require("../Singletons/RequestService");

async function createNewTable(req, res) {

    const {name, collumns} = req.body;
    const requestService = RequestService.getInstance();
    const userSystem = requestService.getUsersSystem();
    const realName = name + userSystem.uid;


    const tableExists = await doesTableExists(realName);

    if(collumns.length <= 1)
    {
        res.json(
            {
                event: "error", 
                code: "Consistance error", 
                message: "You should send an array 'collumns' with your table's collumns data, see the docs here: ",
            }
        );
    }


    if(tableExists)
    {
        res.json(
            {
                event: "error", 
                code: "Consistance error", 
                message: "A table with this name already exists!",
            }
        );
        return;
    }

    if(!tableExists)
    {
        const tableCreation = await createTable(realName, collumns);
        
        if(tableCreation.status === 'OK')
        {  
            const userSystem = requestService.getUsersSystem();
            await MetaTables.create({
                systemId: userSystem.systemId,
                nameTable: realName,
                simpleName: name
            }).then(async (metaTable) => {

                let newRows = [];
                console.log(tableCreation);
                
                const collumnData = tableCreation.collumnData;
                collumnData.map((collumn) => {
                    newRows.push({
                        tableId: metaTable.tableId,
                        nameCollumn: collumn.getName(),
                        type: collumn.getType(),
                        sizeLabel: collumn.getSizeLabel(),
                        sizeValue: collumn.getSizeValue(),
                        optionAllowNull: collumn.getAllowNull(),
                        optionAutoIncrement: collumn.getAutoIncrement(),
                        optionPrimaryKey: collumn.getPrimaryKey()
                    })
                })

                await MetaCollumns.bulkCreate(newRows).then((result) => {
                    res.json({
                        event: "OK", 
                        code: "Success", 
                        message: "Table Created SuccessFully",
                        data: {
                            table: metaTable,
                            collumns: result
                        }
                    }) 
                })
                
            }).catch(async (err) => {
                const abortedCreation = await deleteTable(realName);
                res.json(
                    {
                        event: "error", 
                        code: "Fatal error", 
                        message: "Something went wrong while trying to register your table in our database",
                        error: err,
                        abortedCreation: abortedCreation
                    }
                );
            })
        }

        // res.json(tableCreation);
    }

   

}

module.exports = createNewTable;