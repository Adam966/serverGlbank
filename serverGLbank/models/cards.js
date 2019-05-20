const sequelize = require('sequelize');
const database = require('../database');

const cards = database.define('card', {
    cardnum: {
        type: sequelize.STRING
    }
})

module.exports = cards;