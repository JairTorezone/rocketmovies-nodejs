const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MoviesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

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

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        name,
        note_id,
        user_id,
      };
    });

    await knex("movie_tags").insert(tagsInsert);

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

  async show(request, response) {
    const { id } = request.params;

    const notes = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name");

    response.json({ ...notes, tags });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async listAll(request, response) {
    const notes = await knex("movie_notes");

    response.json({ notes });
  }

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .groupBy("movie_notes.id")
        .orderBy("movie_notes.title");
    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = MoviesController;
