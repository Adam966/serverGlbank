const sequelize = require('sequelize');
const database = require('../database');

const accInfo = database.define('account', {
    id: {
        type: sequelize.STRING
    },
    amount: {
        type: sequelize.FLOAT
    }
})

module.exports = account;