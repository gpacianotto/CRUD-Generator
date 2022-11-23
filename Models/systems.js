const Sequelize = require('sequelize');
const database = require('../Configs/db');

const System = database.define('systems', {
    systemId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    urlFront: {
        type: Sequelize.STRING
    },
    urlBack: {
        type: Sequelize.STRING
    },
    framework: {
        type: Sequelize.STRING
    },
    lang: {
        type: Sequelize.STRING
    },
    systemToken: {
        type: Sequelize.STRING
    }

})

module.exports = System