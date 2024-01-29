const { Router } = require("express");
const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();
const tagsController = new TagsController();

tagsRoutes.post("/", tagsController.create);

module.exports = tagsRoutes;
