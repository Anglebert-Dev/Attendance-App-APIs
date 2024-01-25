const successHandler = require("../../middleware/successHandler");
const User = require("../models/user.model");

bcrypt = require("bcrypt");
jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    successHandler(user, req, res, next, "", 201);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      throw error;
    }
    // GENERATE JWT TOKEN   // jwt.sign(payload,secret,options)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    successHandler({ user: user, token: token }, req, res, next, "login", 200);
  } catch (error) {
    next(error);
  }
};
