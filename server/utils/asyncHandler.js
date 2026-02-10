const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.log("Error occurred in the request handler:", error.message);
      next(error);
    }
  };
};

export default asyncHandler;
