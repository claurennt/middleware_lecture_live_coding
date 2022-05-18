const pool = require("../db/client");

const updateOneFieldOfMovie = async (req, res, next) => {
  //destructure id from req.params object to retrieve movie that needs to be patched
  const { id } = req.params;

  //destructure the key and the value from the req.body to use them in the SQL statement dynamically
  const [key, value] = Object.entries(req.body)[0];

  try {
    const { rows } = await pool.query(
      `UPDATE movies SET ${key} = $1 WHERE id = $2 RETURNING *`,
      [value, id]
    );

    //handle case when no movie was updated
    if (!rows.length)
      return res
        .status(404)
        .send(`we could not find any movie with id ${id}. No movies updated.`);

    return res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateOneFieldOfMovie };
