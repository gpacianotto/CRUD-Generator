const database = require('../Configs/db');
const TableCollumn = require('./TableCollumn');

async function doesTableExists(name) {
    const query ="SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '"+name+"' AND table_schema = '"+process.env.DB_NAME+"';" 
    let res;
    try {
        res = await database.query(query, {raw: true});
    }catch(error)
    {
        console.log(error);
    }
    
    if(!!res[0][0]["COUNT(*)"])
    {
        return true;
    }

    else{
        return false;
    }
}

async function createTable(name, collumns)
{
    const headerQuery = "CREATE TABLE `" + name + "` (";
    let collumnObjects = [];
    let collumnQuery = "";
    let primaryKey = "";
    let response;
    
    collumns.map(collumn => {
        if(!!collumn?.name && !!collumn?.type)
        {
            collumnObjects.push(new TableCollumn(collumn.name, collumn.type, collumn.size, collumn.options));
        }
    });

    collumnObjects.map((collumn, index) => {
        collumnQuery = collumnQuery + collumn.generateSQL() + ", ";

        if(!!collumn.primaryKey)
        {
            primaryKey = collumn.name;
        }
    });


    response = {
        query: "",
        status: "",
        message: ""
    }

    if(!primaryKey)
    {
        response.query = undefined;
        response.message= "you should provide a primary key";
        response.status = "error";
        return response;
    }

    const fullQuery =  headerQuery + collumnQuery + "PRIMARY KEY (" + primaryKey + ")" + ");";

    try {
        response.query = await database.query(fullQuery, {raw: true});
        response.status = "OK";
        response.message = "Tabela criada com sucesso!!",
        response.collumnData = collumnObjects;
        
    }
    catch(err) {
        console.log(err);

        response.query = undefined;
        response.message = err;
        response.status = "error"
    }

    
    return response;
}

async function deleteTable(name) {
    let response = {
        event: "",
        code: "",
        message: "",
        data: undefined
    }

    try {
        response.data = await database.query("DROP TABLE IF EXISTS `"+ name + "`;", {raw: true});
        response.event = "OK"
        response.message = "Table excluded successfully: " + name
    }
    catch(err) {
        response.event = "error"
        response.code = "Syntax error SQL"
        response.message = "An error ocurred while trying to delete your table, error: " + err
    }

    return response;
} 

async function runSQL(sql) {
    let response = {
        event: "",
        code: "",
        message: "",
        data: undefined
    }

    try {
        response.data = await database.query(sql, {raw: true});
        response.event = "OK"
        response.message = "SQL executed Successfully: " + sql
    }
    catch(err) {
        response.event = "error"
        response.code = "Syntax error SQL"
        response.message = "An error ocurred while trying to execute your SQL, error: " + err
    }

    return response;
}


const operations = {
    doesTableExists: doesTableExists,
    createTable: createTable,
    deleteTable: deleteTable,
    runSQL: runSQL
}

module.exports = operations