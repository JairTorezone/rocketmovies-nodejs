const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class TagsController {
  async create(request, response) {
    const { name, note_id, user_id } = request.body;

    if (!name) {
      throw new AppError("Nome não de ser vazio");
    }

    // if (isNaN(note_id) && isNaN(parseFloat(note_id))) {
    //   throw new AppError("Id da NOTA inválido, digite somente número");
    // }

    // if (isNaN(user_id) && isNaN(parseFloat(user_id))) {
    //   throw new AppError("Id do USUÁRIO inválido, digite somente número");
    // }

    await knex("movie_tags").insert({
      name,
      note_id,
      user_id,
    });

    return response.json();
  }
}

module.exports = TagsController;
