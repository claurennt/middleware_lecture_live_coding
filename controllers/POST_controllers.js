const pool = require("../db/client");

const createNewMovie = async (req, res) => {
  //destructure values from request body for create operation in the database
  const { title, director, year } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO movies (title,director,year) VALUES ($1,$2,$3) RETURNING *",
      [title, director, year]
    );
    return res.status(201).send(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { createNewMovie };
