class ApiError extends Error {
  constructor(statusCode, message="something went wrong", errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message=message;
    this.success = false; 

    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };