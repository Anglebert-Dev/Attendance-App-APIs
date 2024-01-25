const { Op } = require("sequelize");
const successHandler = require("../../middleware/successHandler");
const Attendance = require("../models/attendance.model");
const Student = require("../models/student.model");

exports.createAttendance = async (req, res, next) => {
  try {
    const { student_id, status } = req.body;
    const attendace = await Attendance.create({ student_id, status });
    successHandler(attendace, req, res, next);
  } catch (err) {
    next(err);
  }
};

// monthly attendance report  report

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { class_id, month } = req.query;

    if (!class_id || !month) {
      const error = new Error("class_id and month are required parameters");
      error.status = 400;
      throw error;
    }

    const attendance = await Attendance.findAll({
      attributes: ["status", "class_date"],
      include: [
        {
          model: Student,
          as: "Student",
          attributes: ["name"],
          where: { class_id },
        },
      ],
      order: [["class_date", "ASC"]],
    });

    const filteredAttendance = attendance.filter((record) => {
      const recordMonth = new Date(record.class_date).toLocaleString(
        "default",
        { month: "long" }
      );
      return recordMonth.toLowerCase() === month.toLowerCase();
    });

    successHandler(filteredAttendance, req, res, next);
  } catch (error) {
    next(error);
  }
};
