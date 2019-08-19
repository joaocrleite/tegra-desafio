const Sequelize = require('sequelize');

const db = require('../../database/connection');

const User = db.define('user', {
    name :{
        type: Sequelize.STRING,
    },
});

module.exports = User;