const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

const generateVerificationCode = () => {
  const code = uuidv4();
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 1);
  return { code, expirationTime };
};

const sendVerificationEmail = (user, verificationCode) => {
  const mailOption = {
    from: process.env.GMAIL_EMAIL,
    to: user.email,
    subject: "Email Verification",
    text: `Click the following link to verify your email: http://localhost:5000/api/v1/auth/verify-email/${verificationCode}`,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

const generateResetToken = () => {
  const resetToken = uuidv4();
  const resetTokenExpiration = new Date();
  resetTokenExpiration.setMinutes(resetTokenExpiration.getMinutes() + 3);
  return { resetToken, resetTokenExpiration };
};

const sendResetTokenEmail = (user, resetToken) => {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: user.email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://localhost:5000/api/v1/auth/reset-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  generateResetToken,
  sendResetTokenEmail,
};
