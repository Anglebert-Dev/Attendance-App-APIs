const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

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
      unique: 'composite_index', // Use a unique name for the composite index
    },
  },
);

module.exports = Class;
