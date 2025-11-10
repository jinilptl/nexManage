const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.log("Error occurred in the request handler:", error.message);
      next(error); // it for global middleware of error handling so made it in the app.js using app.use()
    }
  };
};

export default asyncHandler;
