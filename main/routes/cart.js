const express = require("express");
const Routes = express.Router();
const CartController = require("../MVC/Controllers/cart");
const authorization = require("../midleware/authorization");

Routes.post(
  "/create",
  authorization.verifyToken,
  CartController.handleCreateCart
);
Routes.put("/payment", authorization.verifyToken, CartController.handlePayemnt);
Routes.put(
  "/update-quantity",
  authorization.verifyToken,
  CartController.handleUpdateQuantity
);
Routes.delete(
  "/delete",
  authorization.verifyToken,
  CartController.handleDelete
);
Routes.get(
  "/",
  authorization.verifyToken,
  CartController.handleGetAllCartBtyUserID
);

module.exports = Routes;
