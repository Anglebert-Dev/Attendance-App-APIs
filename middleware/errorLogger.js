const logger = require("../src/config/logger");

const errorLogger = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorLogger;
