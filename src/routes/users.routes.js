const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const usersController = new UsersController();

const usersRoutes = Router();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/users/:user_id", usersController.update);
usersRoutes.get("/users", usersController.index);
usersRoutes.get("/users/:id", usersController.show);
usersRoutes.delete("/users/:id", usersController.delete);

module.exports = usersRoutes;



