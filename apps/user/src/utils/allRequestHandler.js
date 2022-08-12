export const allRequestHandler = (req, res, next) => {
  res.status(406).send({
    message: "Not Acceptable",
  });
};
