const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const handleCastErrorDB = (err) => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`,
    errors: [
      {
        field: err.path,
        message: `Invalid ${err.path}`,
        value: err.value,
      },
    ],
  };
};

const handleDuplicateFieldsDB = (err) => {
  const duplicatedFields = Object.keys(err.keyValue || {});

  return {
    statusCode: 400,
    message: `${duplicatedFields.join(", ")} already exists`,
    errors: duplicatedFields.map((field) => ({
      field,
      message: `${field} already exists`,
      value: err.keyValue[field],
    })),
  };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((error) => ({
    field: error.path,
    message: error.message,
    value: error.value,
  }));

  return {
    statusCode: 400,
    message: "Validation failed",
    errors,
  };
};

const handleJWTError = () => {
  return {
    statusCode: 401,
    message: "Invalid token. Please login again",
    errors: null,
  };
};

const handleJWTExpiredError = () => {
  return {
    statusCode: 401,
    message: "Your token has expired. Please login again",
    errors: null,
  };
};

const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      statusCode: 400,
      message: "File is too large. Maximum size is 2MB",
      errors: null,
    };
  }

  return {
    statusCode: 400,
    message: err.message || "File upload error",
    errors: null,
  };
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    errors: err.errors || null,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
    errors: null,
  });
};

const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
    name: err.name,
    message: err.message,
    code: err.code,
    keyValue: err.keyValue,
    errors: err.errors,
    path: err.path,
    value: err.value,
    statusCode: err.statusCode || 500,
    isOperational: err.isOperational || false,
    stack: err.stack,
  };

  if (err.name === "CastError") {
    const handled = handleCastErrorDB(err);
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (err.code === 11000) {
    const handled = handleDuplicateFieldsDB(err);
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (err.name === "ValidationError") {
    const handled = handleValidationErrorDB(err);
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (err.name === "JsonWebTokenError") {
    const handled = handleJWTError();
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (err.name === "TokenExpiredError") {
    const handled = handleJWTExpiredError();
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (err instanceof multer.MulterError) {
    const handled = handleMulterError(err);
    error = {
      ...error,
      ...handled,
      isOperational: true,
    };
  }

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, res);
  }

  return sendErrorProd(error, res);
};

module.exports = {
  notFound,
  errorHandler,
};