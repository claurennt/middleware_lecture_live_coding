const getOnlyMiddleware = (request, response, next) => {
  if (request.method === "GET") {
    next(); //goes to next middleware/function in the line if the request is a GET request
  } else {
    return response
      .status(405)
      .send(
        `${request.method} request not allowed on path "${request.originalUrl}".`
      );
    //return response.sendStatus(403); //returns a 403 forbidden status code if the request is not a GET request
  }
};

module.exports = getOnlyMiddleware;
