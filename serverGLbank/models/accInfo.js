const sequelize = require('sequelize');
const database = require('../database');

const accInfo = database.define('account', {
    amount: {
        type: sequelize.FLOAT
    }
})

module.exports = accInfo;