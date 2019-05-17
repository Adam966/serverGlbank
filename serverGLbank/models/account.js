const sequelize = require('sequelize');
const database = require('../database');

const account = database.define('account', {
    accnum: {
        type: sequelize.STRING
    },
    amount: {
        type: sequelize.FLOAT
    },
    idclient: {
        type: sequelize.INTEGER 
    }
})

module.exports = account;