const Sequelize = require('sequelize');
const database = require('../Configs/db');

const User = require('./user');
const System = require("./systems");

const Account = database.define('account', {
    accountId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    systemId: {
        type: Sequelize.INTEGER,
        references:{
            model: 'systems',
            key: 'systemId'
        },
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'userId'
        }
    },
    passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.ENUM('common-user', "admin", "root"),
        allowNull: false
    }

})


System.hasMany(Account);

module.exports = Account