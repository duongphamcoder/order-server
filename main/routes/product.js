const express = require("express");
const Routes = express.Router();
const ProductController = require("../MVC/Controllers/product");
const authorization = require("../midleware/authorization");

Routes.post("/create-product", ProductController.handleCreateProduct);
Routes.post("/create-category", ProductController.handleCreateCategory);
Routes.get("/category", ProductController.handleGetAllCategory);
Routes.post(
  "/update",
  authorization.verifyAdmin,
  ProductController.handleUpdateProduct
);
Routes.delete(
  "/delete",
  authorization.verifyAdmin,
  ProductController.handleDeleteProduct
);
Routes.get("/", ProductController.handleGetProductByCategory);

module.exports = Routes;
