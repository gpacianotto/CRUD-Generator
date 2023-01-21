const Sequelize  = require('sequelize');
const database = require('../Configs/db');
const System = require('./systems');
const MetaTables = database.define('meta-tables', {
    tableId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    systemId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'systems',
            key: 'systemId'
        },
        allowNull: false
    },
    nameTable: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
    
})

System.hasMany(MetaTables);

module.exports = MetaTables;