const mongoose = require("mongoose");

const Cart = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: Number,
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

class CartModel {
  init() {
    return mongoose.model("carts", Cart);
  }

  async updateStatus(user_id) {
    const model = this.init();
    const result = await model
      .update({ user_id, status: 0 }, { status: 1 })
      .then(() => true)
      .catch(() => false);
    return result;
  }

  async updateQuantity(obj) {
    const { quantity, ...querys } = obj;
    const model = this.init();
    const result = await model
      .updateOne(querys, { quantity })
      .then(() => true)
      .catch(() => false);

    return result;
  }

  async findUnpaidProducts(user_id, product_id) {
    const model = this.init();
    const result = await model.findOne({ user_id, product_id, status: 0 });
    return result;
  }

  async createCart(obj) {
    const model = this.init();
    const cart = new model(obj);
    const result = await cart
      .save()
      .then(() => true)
      .catch(() => false);
    return result;
  }

  async retrieveAllUnpaidProductsByUserID(user_id) {
    const model = this.init();
    const result = await model.find({ user_id, status: 0 });
    return result;
  }

  async deleteCartByID(_id) {
    const model = this.init();
    const result = await model
      .deleteOne({ _id })
      .then(() => true)
      .catch(() => false);
    return result;
  }
}

module.exports = new CartModel();
