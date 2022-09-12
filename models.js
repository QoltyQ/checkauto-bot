const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    requests: {type: DataTypes.INTEGER, defaultValue: 0},
    isVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
})

module.exports = User;