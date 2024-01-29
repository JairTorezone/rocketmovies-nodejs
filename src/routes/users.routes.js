const { Router } = require("express");
const UsersController = require("../controllers/UsersController");

const usersController = new UsersController();

const usersRoutes = Router();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/:user_id", usersController.update);
usersRoutes.get("/", usersController.index);
usersRoutes.get("/:id", usersController.show);
usersRoutes.delete("/:id", usersController.delete);

module.exports = usersRoutes;
