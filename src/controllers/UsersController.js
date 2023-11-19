const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body;

    if (!name) {
      throw new AppError("Nome do usuário  é obrigatório");
    }

    const user = knex("users");
    console.log(user);

    const checkEmailExist = knex("users").where({ email: email }).first();
    console.log(checkEmailExist);

    if (checkEmailExist && checkEmailExist.id !== user.id) {
      throw new AppError("Email já esta cadastrado com outro usuário");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const users = await knex("users").where({ id }).first();

    return response.json({ users });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("users").where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const users = await knex("users").orderBy("name");

    return response.json({ users });
  }

  async update(request, response) {
    const { id, name, email } = request.body;
    const { user_id } = request.params;

    const user = await knex("users").where({ id: user_id }).first();
    if (!user) {
      throw new AppError("Usuário não cadastrado");
    }

    const checkEmailExist = await knex("users").where({ email: email }).first();
    if (checkEmailExist && checkEmailExist.id !== user.id) {
      throw new AppError("Email já esta cadastrado com outro usuário");
    }

    await knex("users").where({ id: user_id }).update({ name, email });

    return response.json({ user });
  }
}

module.exports = UsersController;
