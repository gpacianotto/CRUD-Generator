const Sequelize = require('sequelize');
const database = require('../Configs/db');

const User = database.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
})

module.exports = User