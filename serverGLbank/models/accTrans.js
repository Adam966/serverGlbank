const sequelize = require('sequelize');
const database = require('../database');

const accTrans = database.define('transaction', {
    transamount: {
        type: sequelize.FLOAT
    },
    transdate: {
        type: sequelize.STRING
    },
    recaccount: {
        type: sequelize.STRING
    }
})

module.exports = accTrans;