const sequelize = require('sequelize');
const database = require('../database');

const cardTrans = database.define('cardtrans', {
    transdate: {
        type: sequelize.STRING
    },
    transamount: {
        type: sequelize.FLOAT
    }
})

module.exports = cardTrans;