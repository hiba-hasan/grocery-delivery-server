export default function errorMiddleWare(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  try {
    if (err.code == 11000) {
      error = new Error("Duplicate key found");
      error.statusCode = 400;
    }

    if (err.name == "CastError") {
      error = new Error("Resource not found");
      error.statusCode = 404;
    }

    if (err.name == "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(","));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  } catch (error) {
    console.log(error);
  }
}
