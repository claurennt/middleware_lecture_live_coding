const express = require("express");

const moviesRouter = express.Router();

const checkIfReqBodyExists = require("../middlewares/checkIfReqBodyExists");
const checkAdminToken = require("../middlewares/checkAdminToken");

// controllers
const {
  deleteMovieById,
  deleteMultipleMovies,
} = require("../controllers/DELETE_controllers");

const {
  getAllMovies,
  getOneMovieById,
} = require("../controllers/GET_controllers");

const { updateOneMovie } = require("../controllers/PUT_controllers");

const { createNewMovie } = require("../controllers/POST_controllers");

moviesRouter
  .route("/")
  .get(getAllMovies)
  .post(createNewMovie)
  .delete(checkIfReqBodyExists, checkAdminToken, deleteMultipleMovies);

moviesRouter
  .route("/:id")
  .get(getOneMovieById)
  .put(checkIfReqBodyExists, updateOneMovie)
  .delete(deleteMovieById);

module.exports = moviesRouter;
