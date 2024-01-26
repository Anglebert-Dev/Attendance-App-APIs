const successHandler = require("../../middleware/successHandler");
const {
  sendVerificationEmail,
  generateVerificationCode,
} = require("../../utils/email.utils");
const User = require("../models/user.model");

bcrypt = require("bcrypt");
jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      role,
      password: hashedPassword,
      verificationCode: generateVerificationCode(),
    });
    sendVerificationEmail(user, user.verificationCode);
    successHandler(user, req, res, next, "", 201);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.param;
    const user = await User.findOne({ where: { verificationCode } });

    if (user) {
      await user.update({ isVerified: true, verificationCode: null });
      res.status(200).json({ message: "Email verification successful." });
    } else {
      res.status(400).json({ error: "Invalid verification code." });
    }
  } catch (error) {
    next();
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
    const payload = {
      user_id: user.user_id,
      role: user.role,
      // Add other claims as needed
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    successHandler({ user: user, token: token }, req, res, next, "login", 200);
  } catch (error) {
    next(error);
  }
};
