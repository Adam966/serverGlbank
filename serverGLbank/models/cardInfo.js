const sequelize = require('sequelize');
const database = require('../database');

const cardInfo = database.define('card', {
    expirem: {
        type: sequelize.INTEGER
    },
    expirey: {
        type: sequelize.STRING
    }
})

module.exports = cardInfo;