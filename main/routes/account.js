const express = require("express");
const Routes = express.Router();

const AccountController = require("../MVC/Controllers/account");
const midleAuthorization = require("../midleware/authorization");

Routes.post("/create", AccountController.handleCreeteAccount);
Routes.post("/login", AccountController.handleLogin);
Routes.post("/logout", AccountController.handleLogout);
Routes.get("/refreshToken", AccountController.handleRefreshToken);
Routes.post(
  "/authorization",
  midleAuthorization.verifyAdmin,
  AccountController.handleAuthorization
);
Routes.delete(
  "/delete",
  midleAuthorization.verifyAdmin,
  AccountController.handleDeteleAccount
);
Routes.get(
  "/profile",
  midleAuthorization.verifyToken,
  AccountController.handleGetProfile
);
module.exports = Routes;
