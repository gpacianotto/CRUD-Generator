const { doesTableExists, runSQL } = require("../Helpers/table-operations");
const MetaCollumns = require("../Models/meta-collumns");
const MetaTables = require("../Models/meta-tables");
const RequestService = require("../Singletons/RequestService");

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

async function create(req, res) {
    const tableId = req.params.tableId;

    const requestService = RequestService.getInstance();
    const system = requestService.getCurrentSystem();

    const metaTable = await doesMetaTableExist(tableId);

    const {values} = req.body;

    if(!values)
    {
        res.json({
            event: "error",
            code: "Input error",
            message: "You should enter with 'values' key object",
        });
        return;
    }

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
            message: "Tou don't have access to this table!",
        });
        return;
    }
    let userValuesEntries;
    try{
        userValuesEntries = Object.entries(values);
    }
    catch(err){
        res.json({
            event: "error",
            code: "Input error",
            message: "You should enter with 'values' key object",
            error: err
        });
        return;
    }
    
    const collumns = metaTable.collumns;
    let SQLString = "INSERT INTO `" + metaTable.nameTable + "` (";
    
    collumns.map((col) => {
        if(!!col.optionAutoIncrement)
        {
            return "AUTO INCREMENT";
        }

        SQLString = SQLString + col.nameCollumn + ", ";
    })
    SQLString = SQLString.slice(0, -2);
    SQLString = SQLString + ") VALUES("

    const successValues = collumns.map((col) => {

        if(!!col.optionAutoIncrement)
        {
            return "AUTO INCREMENT";
        }
        const value = userValuesEntries.find(obj => obj[0] === col.nameCollumn);

        if(!!value)
        {
            SQLString = SQLString + "'" + value[1] + "', ";
        }
        else {
            if(!!col.optionAllowNull)
            {
                SQLString = SQLString + "NULL, ";
            }
            else{
                return false;
            }
        }

        return true;
        
    })
    if(successValues.some(value => value === false))
    {
        res.json({
            event: "error",
            code: "Insuficient Data",
            message: "You are not sending all the mandatory fields!",
        });
        return;
    }
    SQLString = SQLString.slice(0, -2);
    SQLString = SQLString + ");"

    const createRows = await runSQL(SQLString);

    if(createRows?.event === "OK")
    {
        res.json({
            event: "OK",
            message: "your data has been stored successfully",
            response: createRows.data,
        });
    }


    res.json(createRows);

}

module.exports = create;