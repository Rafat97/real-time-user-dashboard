export const errorHandler = (err, req, res, next) => {
  console.error(err);
  let errorResponse = {
    message: err.message,
  };
  res.status(400).json(errorResponse);
};
