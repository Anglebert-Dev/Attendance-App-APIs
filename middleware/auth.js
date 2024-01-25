// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const errorHandler = require('./errorhandler');
const { JWT_SECRET } = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw { name: 'JsonWebTokenError', message: 'Invalid token. User not found.' };
      }

      req.user = user;
      next();
    } else {
      throw { status: 401, message: 'You are not authenticated.' };
    }
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { id, isAdmin } = req.user;
      const requestedUserId = req.params.id;

      if (id == requestedUserId || isAdmin) {
        next();
      } else {
        throw { status: 403, message: 'You are not allowed to perform this action.' };
      }
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const { isAdmin } = req.user;

      if (isAdmin) {
        next();
      } else {
        throw { status: 403, message: 'You are not allowed to perform this action.' };
      }
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
