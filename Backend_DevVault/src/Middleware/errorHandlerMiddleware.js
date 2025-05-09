import apiError from "../utils/apiError.js";
export const errorHandler = (err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      message: "Unexpected Error",
      success: "false",
    });
  }
};
