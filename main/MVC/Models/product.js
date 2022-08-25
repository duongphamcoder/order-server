const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorys",
    },
    description: String,
    photoURL: String,
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

class ProductModel {
  init() {
    return mongoose.model("product", Product);
  }

  async updateProduct(obj) {
    const { _id, ...data } = obj;
    const model = this.init();
    const result = await model
      .updateOne({ _id }, data)
      .then(() => true)
      .catch(() => false);

    return result;
  }

  async findById(_id) {
    const model = this.init();
    return await model.findById(_id);
  }

  async findAllProductByCategory(_id) {
    const model = this.init();
    return await model.find({ category_id: _id, status: 0 });
  }

  async findAllProductByCategoryWithLimit(_id, limit) {
    const model = this.init();
    return await model.find({ category_id: _id, status: 0 }).limit(limit);
  }

  async findAllProduct() {
    const model = this.init();
    return await model.find({ status: 0 });
  }

  async createProduct(obj) {
    const model = this.init();
    const product = new model(obj);
    return await product
      .save()
      .then(() => true)
      .catch(() => false);
  }
}

module.exports = new ProductModel();
