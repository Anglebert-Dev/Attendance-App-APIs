// associations.js
const Attendance = require('../src/models/attendance.model');
const Class = require('../src/models/class.model');
const Student = require('../src/models/student.model');


// Define the relationships
Student.belongsTo(Class, { as: 'Class', foreignKey: 'class_id' });
Class.hasMany(Student, { onDelete: 'CASCADE', foreignKey: 'class_id' });

// student and attendance
Attendance.belongsTo(Student, {as:'Student' ,foreignKey: 'student_id' });
Student.hasMany(Attendance, { onDelete: 'CASCADE', foreignKey:'student_id' });

module.exports = { Class, Student ,Attendance };
