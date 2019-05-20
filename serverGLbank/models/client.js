const sequelize = require('sequelize');
const database = require('../database');

const client = database.define('loginclient', {
    login: {
        type: sequelize.STRING
    },
    password: {
        type: sequelize.STRING
    },
    status: {
        type: sequelize.BOOLEAN
    },
    idclient: {
        type: sequelize.INTEGER 
    }
})

module.exports = client;