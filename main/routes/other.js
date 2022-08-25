const express = require("express");
const Routes = express.Router();
const APIController = require("../MVC/Controllers/apiPage");

Routes.get("/pagination", APIController.pagination);
Routes.get("/", APIController.index);

module.exports = Routes;
