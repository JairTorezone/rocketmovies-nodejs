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

  async update(request, response) {
    const { id, title, description, rating } = request.body;
    const { note_id } = request.params;

    console.log(title);

    const movie = await knex("movie_notes").where({ id: note_id });

    if (movie.length < 1) {
      throw new AppError("Filme não cadastrado");
    }

    if (title === "") {
      throw new AppError("O título do filme não pode ser vazio");
    }

    if (description === "") {
      throw new AppError("A descrição não pode ser nem nulo e nem vazio");
    }

    if (isNaN(rating)) {
      throw new AppError("Número inválido, avalie entre 1 a 5");
    }

    if (rating < 1 || rating > 5) {
      throw new AppError("Valor da avaliação tem que esta entre 1 e 5");
    }

    movie.title = title ?? movie.title;
    movie.description = description ?? movie.description;

    await knex("movie_notes").where({ id: note_id }).update({
      title,
      description,
      rating,
    });

    return response.json();
  }
}

module.exports = MoviesController;
