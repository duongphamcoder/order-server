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
        console.log("add", result);
        const message = {
          error: !respone,
          message: respone ? "Add to cart success" : "Add to cart failed",
        };
        return res.json(message);
      }
      console.log("update", result);
      const newQuantity = +quantity + result.quantity;
      console.log(`user_id ${user_id} quantity new ${newQuantity} `);
      const respone = await CartModel.updateQuantity({
        _id: result._id,
        quantity: newQuantity,
      });
      const message = {
        error: !respone,
        message: respone ? "Add to cart success1" : "Add to cart failed1",
        newQuantity,
      };
      return res.json(message);
    } catch (error) {}
  }

  async handleGetAllCartBtyUserID(req, res) {
    try {
      const { _id } = req.user;
      const result = await CartModel.retrieveAllUnpaidProductsByUserID(_id);
      if (result.length) {
        const promises = await result.map((item, index) =>
          ProductModel.findById(item.product_id)
        );
        const products = await Promise.all(promises);
        const data = products.map((item, index) => {
          const obj = {
            _id: item._id,
            name: item.name,
            price: item.price,
            category_id: item.category_id,
            photoURL: item.photoURL,
            cart_id: result[index]._id.toString(),
          };
          return obj;
        });
        const quantitys = {};
        data.forEach((item, index) => {
          quantitys[`${result[index]._id.toString()}`] = parseInt(
            result[index].quantity
          );
        });
        return res.json({
          result: data,
          quantitys,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleUpdateQuantity(req, res) {
    const { cart_id, quantity } = req.body;
    const result = await CartModel.updateQuantity({ _id: cart_id, quantity });
    return res.json({ result });
  }

  async handlePayemnt(req, res) {
    try {
      const { _id } = req.user;
      console.log(_id);
      const user_id = _id;
      const result = await CartModel.updateStatus(user_id);
      return res.json({ error: !result });
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
