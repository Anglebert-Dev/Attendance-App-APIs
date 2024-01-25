// models/user.js
const { Sequelize, DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/db.config');

const User = sequelize.define('User', {
  user_id:{
    type:DataTypes.UUID,
    primaryKey:true,
    defaultValue:UUIDV4
  },
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
});

module.exports = User;