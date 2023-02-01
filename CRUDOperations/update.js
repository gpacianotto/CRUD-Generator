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



async function update(req, res) {
    const tableId = req.params.tableId;

    const {fields, where} = req.body;

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
    let userValuesEntries, userWhereEntries;
    try{
        userValuesEntries = Object.entries(fields);
        userWhereEntries = Object.entries(where);
    }
    catch(err){
        res.json({
            event: "error",
            code: "Input error",
            message: "You should enter with 'fields' key object",
            error: err
        });
        return;
    }

    let SQLString = "UPDATE `" + metaTable.nameTable + "` SET "

    const values = collumns.map((col) => {
        const found = userValuesEntries.find(value => col.nameCollumn === value[0]);

        if(!!found)
        {
            return found[1];
        }

        return found;

    });

    const whereValues = collumns.map((col) => {
        const found = userWhereEntries.find(value => col.nameCollumn === value[0]);

        if(!!found)
        {
            return {
                found: found,
                collumn: col
            }
        }

        return found;
    })

    // if(whereValues.includes(undefined))
    // {
    //     res.json({
    //         event: "error",
    //         code: "Input error",
    //         message: "You haven't sent 'where' object",
    //     });
    //     return;
    // }

    collumns.map((col, index) => {
        if(!!values[index]){
            if(col.type === "integer")
            {
                SQLString = SQLString + col.nameCollumn + " = " + values[index] + ", ";
            }
            else {
                SQLString = SQLString + col.nameCollumn + " = '" + values[index] + "', ";
            }
            
        }
        
        return;
    })

    SQLString = SQLString.slice(0, -2);
    SQLString = SQLString + " WHERE "
    whereValues.map((w) => {
        if(!!w)
        {
            if(w.collumn.type === "integer")
            {
                SQLString = SQLString + w.found[0] + " = " + w.found[1] + " AND "
            }
            else {
                SQLString = SQLString + w.found[0] + " = '" + w.found[1] + "' AND "
            }
        }
        

    })

    SQLString = SQLString.slice(0, -5);

    SQLString = SQLString + ";"

    // res.json({
    //     SQLString: SQLString
    // })

    const response = await runSQL(SQLString);

    if(response.event === "OK")
    {
        res.json({response: response});
        return;
    }
    
    res.json(response);

}

module.exports = update