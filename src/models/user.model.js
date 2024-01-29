// models/user.js
const { Sequelize, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "composite_index",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "composite_index",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  verificationCodeExpiration: {
    type: DataTypes.DATE,
    allowNull: true,  
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
