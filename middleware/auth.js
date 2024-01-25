// middleware/auth.js
const jwt = require("jsonwebtoken");
const errorHandler = require("./errorhandler");
const User = require("../src/models/user.model");

const dotenv = require("dotenv").config();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw {
        status: 401,
        message: "Invalid token format. Bearer token expected.",
      };
    }
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.user_id);

      if (!user) {
        throw {
          name: "JsonWebTokenError",
          message: "Invalid token. User not found.",
        };
      }

      req.user = user;
      next();
    } else {
      throw { status: 401, message: "You are not authenticated." };
    }
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { user_id, role } = req.user;
      const requestedUserId = req.params.user_id;

      console.log("User ID from token:", user_id);
      console.log("Requested User ID from params:", requestedUserId);

      if (user_id == requestedUserId || role === "admin") {
        next();
      } else {
        throw {
          status: 403,
          message: "You are not allowed to perform this action.",
        };
      }
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { role } = req.user;

      if (role === "admin") {
        next();
      } else {
        throw {
          status: 403,
          message: "You are not allowed to perform this action.",
        };
      }
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
