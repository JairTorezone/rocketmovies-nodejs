const { use } = require("express/lib/router");
const knex = require("../database/knex");

class UserRepository {
  async findByEmail(email) {
    const usersEmail = await knex.select("email").from("users");
    return usersEmail;
  }

  async create({ name, email, password, avatar }) {
    const userId = await knex("users").insert({
      name,
      email,
      password,
      avatar,
    });

    return { id: userId };
  }

  async delete({ id }) {
    await knex("users").where({ id }).delete();
  }
}

module.exports = UserRepository;
