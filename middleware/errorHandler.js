const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({ errors, message: 'Validation error(s)' });
  }

  // Sequelize unique constraint violation
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: `Duplicate entry for ${error.path}`,
    }));

    return res.status(400).json({ errors, message: 'Duplicate entry error' });
  }

  // Sequelize foreign key constraint violation
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const errors = err.fields.map((field) => ({
      field,
      message: `Foreign key constraint violation for ${field}`,
    }));

    return res.status(400).json({ errors, message: 'Foreign key constraint error' });
  }

  // Sequelize database error (general case)
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ message: 'Database error' });
  }

  // Authentication errors
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Handle other errors
  if (err.status) {
    // If the error has a status property, use that status
    return res.status(err.status).json({ message: err.message });
  } else {
    // Default to a 500 Internal Server Error for unhandled errors
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = errorHandler;
