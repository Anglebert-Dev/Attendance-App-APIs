const successHandler = require("../../middleware/successHandler");
const Student = require("../models/student.model");
const Attendance = require("../models/attendance.model");

exports.createStudent = async (req, res, next) => {
  try {
    const { name, class_id } = req.body;

    const student = await Student.create({ name, class_id });
    successHandler(student, req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const classes = await Student.findAll();
    successHandler(classes, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student_id = req.params.id;
    console.log(student_id);

    // Check if the class exists
    const existingClass = await Student.findByPk(student_id);
    console.log(existingClass);
    if (!existingClass) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }

    // Delete the class and associated students
    await existingClass.destroy({ include: [Attendance] });

    successHandler(
      { message: "Student deleted successfully" },
      req,
      res,
      next,
      "delete",
      200
    );
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateStudent = async (req, res, next) => {
  try {
    const student_id = req.params.id;
    const { name } = req.body;

    // Check if the class exists
    const existingClass = await Student.findByPk(student_id);
    if (!existingClass) {
      const error = new Error("Student not found");
      error.status = 404;
      throw error;
    }

    // Update the class
    await existingClass.update({ name });

    successHandler(existingClass, req, res, next, "update", 200);
  } catch (error) {
    next(error);
  }
};
