  const { DataTypes } = require("sequelize");
  const sequelize = require("../config/db.config");
  const Student = require("./student.model");


  const Attendance = sequelize.define('attendace' , {
    attendance_id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true
    },
    student_id:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'students', 
        key:"student_id" 
      },
      onDelete:'CASCADE',
      onUpdate:'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Vacation'),
      allowNull: false,
    },
    class_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,  
    },  
  })

  module.exports =Attendance