const pool = require("../db/client");

const deleteMultipleMovies = async (req, res, next) => {
  //destructure the key and the value from the req.body to use them in the SQL statement dynamically
  const [key, value] = Object.entries(req.body)[0];

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM movies WHERE ${key} = $1 RETURNING *`,
      [value]
    );
    if (!rowCount)
      return res
        .status(404)
        .send(
          `we could not find any movie with ${key} = ${value}. No movies deleted.`
        );
    return res.status(200).send(`Successfully deleted ${rowCount} movies.`);
  } catch (err) {
    next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    );
    if (!rowCount)
      return res
        .status(404)
        .send(`we could not find any movie with id ${id}. No movies deleted.`);
    return res
      .status(204)
      .send(`Successfully deleted ${rowCount} movie with id ${id}.`);
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteMultipleMovies, deleteMovieById };
