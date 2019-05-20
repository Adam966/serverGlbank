const sequelize = require('sequelize');
const database = require('../database');

const account = database.define('account', {
    accnum: {
        type: sequelize.STRING
    }
})

module.exports = account;