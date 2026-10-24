function errorHandler(error, req, res, next) {
  console.error("Server error:", error.message);

  const statusCode = error.statusCode || error.status || 500;

  if (statusCode < 500) {
    return res.status(statusCode).json({ message: error.message });
  }

  res.status(500).json({ message: "Something went wrong on the server." });
}

module.exports = errorHandler;
