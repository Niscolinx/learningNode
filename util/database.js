const Sequelize = require('sequelize')

const sequelize = new Sequelize('learning-node', 'root', 'munisco6869', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize