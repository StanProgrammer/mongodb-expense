const Sequelize  = require('sequelize');

const sequelize = new Sequelize(`${process.env.DATABASE_NAME}`,`${process.env.USER_NAME}`, `${process.env.USER_PASSWORD}`, {
    host: `${process.env.DB_HOST}`,
    dialect: 'mysql'
  });
  module.exports=sequelize