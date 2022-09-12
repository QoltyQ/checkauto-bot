const {Sequelize} = require('sequelize');
var tunnel = require('tunnel-ssh'); 
const {NodeSSH} = require('node-ssh')
const {DataTypes} = require('sequelize');



const ssh = new NodeSSH()
const sequelize = new Sequelize('postgres://check_auto:B6d3k9GA@127.0.0.1:5432/checkauto-bot');

const testingConnection = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}       

ssh.connect({
    host: '78.40.109.128',
    username: 'root',
    password: 'nYClp7670p'
}).then(function (){
    testingConnection();
})

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: {type: DataTypes.STRING, unique: true},
    requests: {type: DataTypes.INTEGER, defaultValue: 0},
    isVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
})

module.exports = User;