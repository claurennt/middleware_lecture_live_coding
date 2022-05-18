const express = require("express");

require("dotenv").config();

const app = express();
const path = require("path");
const morgan = require("morgan");

const requestTimeLogger = require("./middlewares/requestTimeLogger");
const getOnlyMiddleware = require("./middlewares/getOnlyMiddleware");
const errorHandler = require("./middlewares/errorHandler");

const moviesRouter = require("./routes/moviesRouter");

const port = 3000;

// app-level middleware to serve images when path is /images/:imageName.imageExtension
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ### App-level BUILT-IN middleware to parse the body of incoming requests
app.use(express.urlencoded({ extended: true })); // body parser middleware for html post forms, extended true allows body to accept any data types, not only strings

app.use(express.json()); // body parser middleware for post requests except hmtl forms post requests

app.use(morgan("dev")); // morgan middleware to log requests:::very similar to our custom requestTimeLogger Middleware
//app.use("/movies", requestTimeLogger);

//binds the getOnlyMiddleware to every request made on path /only-get
app.use("/only-get", getOnlyMiddleware);

app.get("/only-get", (req, res) =>
  res.status(200).send("Fantastic you have used the correct method!")
);

//binds moviesRouter to every request at path starting with /movies
app.use("/movies", moviesRouter);

//binds custom error handler to every reqeust made to our app, must be the last one declared in the app-level middleware stack
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
