const Sequelize = require('sequelize');

module.exports = new Sequelize('glbank', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    opratorsAliases: false,
    define: {
        freezeTableName: true, 
        timestamps: false,
        underscored: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});