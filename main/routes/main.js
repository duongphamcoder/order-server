const AccountRoute = require("./account");
const ProductRoute = require("./product");
const CartRoute = require("./cart");
const OtherRoute = require("./other");

const routes = (app) => {
  app.use("/account", AccountRoute);
  app.use("/product", ProductRoute);
  app.use("/cart", CartRoute);
  app.use("/", OtherRoute);
};

module.exports = routes;
