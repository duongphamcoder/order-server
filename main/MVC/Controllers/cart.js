const CartModel = require("../Models/cart");
const ProductModel = require("../Models/product");
class CartController {
  async handleCreateCart(req, res) {
    try {
      const { product_id, quantity } = req.body;
      const user_id = req.user._id;
      const result = await CartModel.findUnpaidProducts(user_id, product_id);
      if (!result) {
        const respone = await CartModel.createCart({
          user_id,
          product_id,
          quantity,
        });
        const message = {
          error: !respone,
          message: respone ? "Add to cart success" : "Add to cart failed",
        };
        return res.json(message);
      }
      const newQuantity = +quantity + result.quantity;
      const respone = await CartModel.updateQuantity({
        user_id,
        product_id,
        quantity: newQuantity,
      });
      const message = {
        error: !respone,
        message: respone ? "Add to cart success" : "Add to cart failed",
        newQuantity,
      };
      return res.json(message);
    } catch (error) {}
  }

  async handleGetAllCartBtyUserID(req, res) {
    try {
      const { _id } = req.user;
      const result = await CartModel.retrieveAllUnpaidProductsByUserID(_id);
      const promises = result.map((item) =>
        ProductModel.findById(item.product_id)
      );
      const respone = await Promise.all(promises);
      const newRespone = respone.map((item, index) => {
        const {
          _id,
          name,
          price,
          photoURL,
          category_id,
          createdAt,
          updatedAt,
        } = item;
        return {
          _id,
          name,
          price,
          photoURL,
          category_id,
          createdAt,
          updatedAt,
          cart_id: result[index]._id,
        };
      });
      let quantitys = {};
      result.forEach((item) => {
        quantitys[`${item._id}`] = item.quantity;
      });
      const prices = respone.map(
        (item, index) => item.price * quantitys[`${item._id}`]
      );
      const total = prices.reduce((prev, curent) => prev + curent);
      return res.json({
        result: newRespone,
        quantitys,
        prices,
        total,
        cart: result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async handlePayemnt(req, res) {
    try {
      const { quantitys } = req.body;
      const { _id } = req.user;
      const temps = Object.keys(quantitys);
      const promises = temps.map((item, index) =>
        CartModel.updateQuantity({
          _id: item,
          quantity: parseInt(quantitys[item]),
        })
      );
      const respone = await Promise.all(promises);
      const checkPayment = respone.includes(false);
      if (!checkPayment) {
        const payemnt = await CartModel.updateStatus(_id);
      }
      const message = {
        error: checkPayment,
        message: !checkPayment ? "Payment success" : "Payment failed",
      };
      return res.json(message);
    } catch (error) {
      console.log(error);
    }
  }

  async handleDelete(req, res) {
    try {
      const { id } = req.query;
      const result = await CartModel.deleteCartByID(id);
      const message = {
        error: !result,
        message: result ? "Delete success" : "Delete failed",
      };
      return res.json(message);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CartController();
