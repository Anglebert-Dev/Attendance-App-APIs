const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const logger = require("../config/logger");


const Class = sequelize.define(
  "classes",
  {
    class_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "composite_index", // Use a unique name for the composite index
    },
  },
  {
    hooks: {
      beforeCreate: (classInstance, options) => {
        logger.info(`Class created: ${classInstance.name}`);
      },
      beforeUpdate: (classInstance, options) => {
        logger.info(`Class updated: ${classInstance.name}`);
      },
      beforeDestroy: (classInstance, options) => {
        logger.info(`Class deleted: ${classInstance.name}`);
      },
    },
  }
);

module.exports = Class;
