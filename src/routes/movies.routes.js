const { Router } = require("express");
const MoviesController = require("../controllers/MoviesController");

const moviesRoutes = Router();
const moviesController = new MoviesController();

moviesRoutes.post("/:user_id", moviesController.create);
moviesRoutes.get("/", moviesController.show);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.put("/:note_id", moviesController.update);

module.exports = moviesRoutes;
