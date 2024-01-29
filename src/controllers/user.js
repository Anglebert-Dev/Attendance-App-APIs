const successHandler = require("../../middleware/successHandler");
const {
  sendVerificationEmail,
  generateVerificationCode,
  sendResetTokenEmail,
  generateResetToken,
} = require("../../utils/email.utils");
const User = require("../models/user.model");

bcrypt = require("bcrypt");
jwt = require("jsonwebtoken");

const { code, expirationTime } = generateVerificationCode();

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      const error = new Error(
        "Username, email, password, and role are required."
      );
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      role,
      password: hashedPassword,
      verificationCode: code,
      verificationCodeExpiration: expirationTime,
    });
    sendVerificationEmail(user, user.verificationCode);
    successHandler(user, req, res, next, "", 201);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOne({ where: { verificationCode } });

    if (!user) {
      const error = new Error("Invalid verification code.");
      error.status = 400;
      throw error;
    }

    if (user.isVerified) {
      successHandler(user, req, res, next, "User already verified", 200);
    } else if (
      user.verificationCodeExpiration &&
      user.verificationCodeExpiration > new Date()
    ) {
      await user.update({
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiration: null,
      });
      successHandler(user, req, res, next, "User verified", 200);
    } else if (
      user.verificationCodeExpiration &&
      user.verificationCodeExpiration <= new Date()
    ) {
      await user.destroy();
      const error = new Error("Verification code has expired.");
      user;
      error.status = 400;
      throw error;
    } else {
      const error = new Error("Invalid verification code.");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required.");
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found.");
      error.status = 400;
      throw error;
    }

    const { resetToken, resetTokenExpiration } = generateResetToken();
    console.log(resetToken, resetTokenExpiration);

    await user.update({
      resetToken: resetToken,
      resetTokenExpiration: resetTokenExpiration,
    });

    sendResetTokenEmail(user, resetToken);

    res.status(200).json({ user: user, message: "Password reset email sent." });
  } catch (error) {
    next(error);
  }
};

// user.controller.js

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const newPassword = req.body.password;

    console.log(newPassword, resetToken);

    if (!resetToken || !newPassword) {
      const error = new Error("Reset token and new password are required.");
      error.status = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOne({ where: { resetToken } });

    if (user && user.resetTokenExpiration > new Date()) {
      await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null,
      });
      res
        .status(200)
        .json({ user: user, message: "Password reset successful." });
    } else {
      const error = new Error("Invalid reset token or token has expired.");
      error.status = 400;
      throw error;
    }
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
