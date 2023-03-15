class TableCollumn {
    constructor (name, type, size, options) {
        const possibleSizes = ['variable', 'fixed'];
        const possibleTypes = ['integer', 'string'];
        this.primaryKey = false;
        this.autoIncrement = false;
        this.name = name;
        this.allowNull = this.defaultAllowNull();

        if(options?.allowNull != undefined)
        {
            this.allowNull = options?.allowNull;
        }
        if(options?.primaryKey != undefined)
        {
            this.primaryKey = options?.primaryKey;
        }
        if(options?.autoIncrement != undefined)
        {
            this.autoIncrement = options?.autoIncrement;
        }

        if(possibleSizes.includes(size?.label))
        {
            
            // if(!this.size?.value)
            // {
            //     this.size = undefined;
            // }
            // else{
            //     this.size = size;
            // }
            this.size = size;
        }
        else {
            this.size = undefined;
        }

        if(possibleTypes.includes(type))
        {
            this.type = type;
        }
        else{
            this.type = undefined;
        }
        
        
        
    }

    defaultAllowNull() 
    {
        if(this.primaryKey)
        {
            return false;
        }
        return true;
    }

    generateTypeSQL()
    {
        let query;

        if(this.type === 'integer')
        {
            return 'INT';
        }
        if(this.type === 'string')
        {
            if(this.size?.label === 'variable')
            {
                return 'VARCHAR(' + this.size?.value + ')';
            }
            if(this.size?.label === 'fixed')
            {
                return 'CHAR(' + this.size?.value + ')';
            }
        }
    }

    generateOptionsSQL()
    {
        return (!this.allowNull ? " NOT NULL" : "") + (this.autoIncrement ? " AUTO_INCREMENT": "")
    }

    generateSQL()
    {   
        return this.name + " "+ this.generateTypeSQL()  + this.generateOptionsSQL();
    }

    getName()
    {
        return this.name;
    }

    getAllowNull()
    {
        return this.allowNull;
    }

    getAutoIncrement()
    {
        return this.autoIncrement;
    }

    getSize()
    {
        return this.size;
    }

    getSizeLabel()
    {
        return this.size?.label;
    }

    getSizeValue()
    {
        return this.size?.value;
    }

    getPrimaryKey()
    {
        return this.primaryKey;
    }

    getType()
    {
        return this.type;
    }
}

module.exports = TableCollumn