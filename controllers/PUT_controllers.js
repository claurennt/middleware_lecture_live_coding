const pool = require("../db/client");

const updateOneMovie = async (req, res) => {
  //use id parameter to retrieve movie from database that has to be updated
  const { id } = req.params;

  //destructure values from request body for update operation in the database
  const { title, director, year } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE movies set title = $1, director= $2, year= $3 WHERE id = $4 RETURNING *",
      [title, director, year, id]
    );
    return res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateOneMovie };
