const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return res.status(409).json({ message: `Duplicate value for field: ${field}` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "Server error" });
};

module.exports = errorHandler;
