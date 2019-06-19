const sequelize = require('sequelize');
const database = require('../database');

const accTrans = database.define('transaction', {
    transamount: {
        type: sequelize.FLOAT
    },
    transdate: {
        type: sequelize.DATE
    },
    recaccount: {
        type: sequelize.STRING
    },
    type: {
        type: sequelize.INTEGER
    },
    idaccount: {
        type: sequelize.INTEGER
    }
})

module.exports = accTrans;