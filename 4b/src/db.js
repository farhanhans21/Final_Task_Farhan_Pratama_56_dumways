const {Sequelize} = require('sequelize')

const db = new Sequelize({
  host: 'localhost',
  dialect:'postgres',
  database:'postgres',
  username:'postgres',
  password:'asusi8',
  port:5432
})

module.exports = db;