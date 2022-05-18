const pool = require("../db/client");

const updateOneMovie = async (req, res) => {
  const { id } = req.params;

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
