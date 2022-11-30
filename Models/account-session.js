const Sequelize = require('sequelize');
const database = require('../Configs/db');

const Account = require('./account');

const AccountSession = database.define('account-session', {
    sessionId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'accounts',
            key: 'accountId'
        },
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    expiresIn: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastUsed: {
        type: Sequelize.STRING,
    }
    
})

module.exports = AccountSession