export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // If it's a validation error from Zod, format it properly
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
