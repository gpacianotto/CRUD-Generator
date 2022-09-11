const Sequelize = require('sequelize');
const database = require('../Configs/db');

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fireBaseUid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.ENUM('root', 'admin', 'common-user'),
        allowNull: false
    },
    fullName: {
        type: Sequelize.STRING(70),
    },
    birthDate: {
        type: Sequelize.DATEONLY
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    website: {
        type: Sequelize.STRING 
    }
})

module.exports = User