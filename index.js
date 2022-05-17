const express = require("express");

require("dotenv").config();

const pool = require("./db/client");
const app = express();
const path = require("path");

const port = 3000;

//serve images from public/images folder when path starts with /images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ### App-level BUILT-IN middleware to parse the body of incoming requests
app.use(express.urlencoded({ extended: true })); // body parser middleware for html post forms, extended true allows body to accept any data types, not only strings

app.use(express.json()); // body parser middleware for post requests except hmtl forms post requests

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
app.use("/only-get", getOnlyMiddleware);

app.get("/only-get", (req, res) =>
  res.status(200).send("Fantastic you have used the correct method!")
);

const requestTimeLogger = (request, response, next) => {
  console.log(
    `${request.method} ${
      request.originalUrl
    }: ${new Date().toLocaleTimeString()}`
  );
  next(); // continue with the next middleware
};

app.use("/movies", requestTimeLogger);

app.get("/movies", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM movies;");
    return res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving movies from DB.");
  }
});

app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM movies WHERE id = $1;", [
      id,
    ]);

    return res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving movies from DB.");
  }
});

app.post("/movies", async (req, res) => {
  const { title, director, year } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO movies (title,director,year) VALUES ($1,$2,$3) RETURNING *",
      [title, director, year]
    );
    return res.status(201).send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving movies from DB.");
  }
});

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;

  const { title, director, year } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE movies set title = $1, director= $2, year= $3 WHERE id = $4 RETURNING *",
      [title, director, year, id]
    );
    return res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving movies from DB.");
  }
});
//check admin credentials
const checkAdminToken = (req, res, next) => {
  const { token } = req.body;
  if (!token || token !== process.env.ADMIN_TOKEN)
    return res.status(401).send("Wrong credentials.");
  next();
};
//condition middleware
const conditionMiddleware = (req, res, next) => {
  if (!Object.keys(req.body).length)
    return res.status(400).send("Please provide a condition with the request.");
  next();
};

app.delete(
  "/movies",
  checkAdminToken,
  conditionMiddleware,
  async (req, res) => {
    //destructure the key and the value from the req.body to use them in the SQL statement dynamically
    const [key, value] = Object.entries(req.body)[0];

    try {
      const { rowCount } = await pool.query(
        `DELETE FROM movies WHERE ${key} = $1 RETURNING *`,
        [value]
      );
      return res.status(200).send(`Successfully deleted ${rowCount} movies.`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error retrieving movies from DB.");
    }
  }
);

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    );
    return res
      .status(204)
      .send(`Successfully deleted ${rowCount} movie with id ${id}.`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving movies from DB.");
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
