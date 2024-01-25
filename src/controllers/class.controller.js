const errorHandler = require("../../middleware/errorhandler");
const successHandler = require("../../middleware/successHandler");

const Class = require("../models/class.model");
const Student = require("../models/student.model");

// create

exports.createClasses = async (req, res, next) => {
  try {
    const { name } = req.body;

    const class_tbl = await Class.create({ name });
    successHandler(class_tbl, req, res, next, "create", 201);
  } catch (error) {
    next(error);
  }
};

// GET CLASSES

exports.getClasses = async (req, res, next) => {
  try {
    const classes = await Class.findAll();
    successHandler(classes, req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    console.log(class_id);

    // Check if the class exists
    const existingClass = await Class.findByPk(class_id);
    console.log(existingClass);
    if (!existingClass) {
      const error = new Error("Class not found");
      error.status = 404;
      throw error;
    }

    // Delete the class and associated students
    await existingClass.destroy({ include: [Student] });

    successHandler(
      { message: "Class deleted successfully" },
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
exports.updateClass = async (req, res, next) => {
  try {
    const class_id = req.params.id;
    const { name } = req.body;

    // Check if the class exists
    const existingClass = await Class.findByPk(class_id);
    if (!existingClass) {
      const error = new Error("Class not found");
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
