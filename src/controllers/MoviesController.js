const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MoviesController {
  async create(request, response) {
    const { title, description, rating } = request.body;
    const { user_id } = request.params;

    if (!title) {
      throw new AppError("O título náo pode ser vazio");
    }

    console.log(typeof rating);

    if (isNaN(rating)) {
      throw new AppError("Número inválido, avalie entre 1 a 5");
    }

    if (rating < 1 || rating > 5) {
      throw new AppError("Avaliação tem que esta entre 1 e 5");
    }

    await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    return response.json(rating);
  }

  async show(request, response) {
    const notes = await knex("movie_notes");

    response.json({ notes });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }
}

module.exports = MoviesController;
