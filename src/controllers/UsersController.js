const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash, compare } = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository");
const UserCreateServices = require("../services/UserCreateServices");

class UsersController {
  async create(request, response) {
    const { name, email, password, avatar } = request.body;

    const userRepository = new UserRepository();
    const userCreateServices = new UserCreateServices(userRepository);

    await userCreateServices.execute({ name, email, password, avatar });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, updated_at, password, old_password } = request.body;
    const user_id = request.user.id;
    console.log("Valor id = " + user_id);

    const user = await knex("users").where({ id: user_id }).first();
    console.log("Usuário: " + user);

    if (!user) {
      throw new AppError("Usuário não cadastrado");
    }

    const checkEmailExist = await knex("users").where({ email: email }).first();

    if (checkEmailExist && checkEmailExist.id !== user.id) {
      throw new AppError("Email já esta cadastrado com outro usuário");
    }

    //** if password iguals old_password/
    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        console.log(old_password, user.password);
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users")
      .where({ id: user_id })
      .update({ name, email, password: user.password });

    user.updated_at = new Date();

    return response.json({ ...user });
  }

  async delete(request, response) {
    const { id } = request.params;

    const userRepository = new UserRepository();
    const userCreateServices = new UserCreateServices(userRepository);

    await userCreateServices.delete({ id });

    return response.json();
  }

  async index(request, response) {
    const users = await knex("users");

    return response.json(users);
  }

  async show(request, response) {
    const { id } = request.params;

    const users = await knex("users").where({ id }).first();

    return response.json({ users });
  }
}

module.exports = UsersController;
