const requestTimeLogger = (request, response, next) => {
  console.log(
    `${request.method} ${
      request.originalUrl
    }: ${new Date().toLocaleTimeString()}`
  );
  next(); // continue with the next middleware
};

module.exports = requestTimeLogger;
