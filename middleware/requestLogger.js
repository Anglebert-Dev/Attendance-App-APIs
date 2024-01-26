const logger = require("../src/config/logger");

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url} received at ${new Date()}`);
  next();
};

module.exports = requestLogger;
