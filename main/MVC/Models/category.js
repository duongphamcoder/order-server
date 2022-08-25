const mongoose = require("mongoose");

const Category = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

class CategoryModel {
  init() {
    return mongoose.model("category", Category);
  }

  async findAllCategory() {
    const model = this.init();
    return await model.find();
  }

  async createCategory(name) {
    const model = this.init();
    const category = new model({ name });
    return await category
      .save()
      .then((res) => true)
      .catch((err) => false);
  }
}

module.exports = new CategoryModel();
