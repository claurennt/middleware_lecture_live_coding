const pool = require("../db/client");

const getAllMovies = async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM movies;");

    return res.status(200).send(rows);
  } catch (err) {
    //calling next and passing the err as an argument will fire the custom error handler if we have one, otherwise the built-in error handler will fire
    next(err);
  }
};

const getOneMovieById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM movies WHERE id = $1;", [
      id,
    ]);
    if (!rows.length)
      return res
        .status(404)
        .send(`We could not find any movie with id ${id} in the database`);

    return res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllMovies, getOneMovieById };
