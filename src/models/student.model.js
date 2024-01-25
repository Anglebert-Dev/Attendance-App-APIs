// student.model.js
const { DataTypes } = require("sequelize");
const Class = require("./class.model");
const sequelize = require("../config/db.config");

const Student = sequelize.define("Student", {
  student_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: "composite_index", // Use a unique name for the composite index
  },
  class_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "classes",
      key: "class_id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});

module.exports = Student;
