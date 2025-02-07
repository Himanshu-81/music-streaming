class ApiError extends Error {
  constructor(
    statusCode, // Fixed typo (was statuscode)
    message = "Something went wrong",
    errors = [],
    stack = "",
    data = null
  ) {
    super(message);
    this.statusCode = statusCode; // Ensure it's statusCode
    this.data = data;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
