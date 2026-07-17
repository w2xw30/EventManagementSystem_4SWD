function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res
      .status(400)
      .json({ error: "Validation failed", details: messages });
  }

  res.status(500).json({ error: "Something went wrong on the server" });
}

module.exports = errorHandler;
