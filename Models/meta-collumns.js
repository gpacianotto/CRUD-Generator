
const Sequelize  = require('sequelize');
const database = require('../Configs/db');
const MetaTables = require('./meta-tables');

const MetaCollumns = database.define('meta-collumns', {
    collumnId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tableId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'meta-tables',
            key: 'tableId'
        },
        allowNull: false
    },
    nameCollumn: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    type: {
        type: Sequelize.ENUM(["string", "integer"]),
        allowNull: false
    },
    sizeLabel: {
        type: Sequelize.ENUM(["variable", "fixed"]),
    },
    sizeValue: {
        type: Sequelize.INTEGER
    },
    optionAllowNull: {
        type: Sequelize.BOOLEAN
    },
    optionAutoIncrement: {
        type: Sequelize.BOOLEAN
    },
    optionPrimaryKey: {
        type: Sequelize.BOOLEAN
    }
})

MetaTables.hasMany(MetaCollumns, {
    foreignKey: "tableId",
    as: "collumns"
});

MetaCollumns.belongsTo(MetaTables, {
    foreignKey: 'tableId',
    as: "table"
})

module.exports = MetaCollumns