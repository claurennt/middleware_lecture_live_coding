//condition middleware
const checkIfReqBodyExists = (req, res, next) => {
  //if there is no body passed with the requset we return a 400 error
  if (!Object.keys(req.body).length)
    return res.status(400).send("Please provide a condition with the request.");
  next();
};

module.exports = checkIfReqBodyExists;
