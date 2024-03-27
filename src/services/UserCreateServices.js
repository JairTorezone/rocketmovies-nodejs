const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateServices {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password, avatar }) {
    if (!name) {
      throw new AppError("Nome do usuário  é obrigatório");
    }

    const usersEmail = await this.userRepository.findByEmail(email);

    const checkEmailExist = usersEmail.filter((e) => e.email === email);

    if (checkEmailExist.length > 0) {
      throw new AppError("Email já esta cadastrado");
    }

    const hashedPassword = await hash(password, 8);

    await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });
  }

  async delete({ id }) {
    await this.userRepository.delete({ id });
  }
}

module.exports = UserCreateServices;
