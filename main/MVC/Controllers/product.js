const ProductModel = require("../Models/product");
const CategoryModel = require("../Models/category");

class ProductController {
  messageError(res) {
    res.json({ err: true, message: "Unable to execute" });
  }
  async handleCreateProduct(req, res) {
    try {
      const { name, price, category_id, photoURL } = req.body;
      const obj = {
        name,
        price: parseInt(price),
        category_id,
        photoURL,
      };
      const result = await ProductModel.createProduct(obj);
      const message = {
        error: !result,
        message: result ? "Create success" : "Create failed",
      };
      return res.json(message);
    } catch (error) {
      this.messageError();
    }
  }

  async handleGetProductByCategory(req, res) {
    try {
      const { category_id } = req.query;
      const result = await ProductModel.findAllProductByCategory(category_id);
      return res.json({ error: false, data: result });
    } catch (error) {
      this.messageError();
    }
  }

  async handleCreateCategory(req, res) {
    try {
      const { name } = req.body;
      const result = await CategoryModel.createCategory(name);
      const message = {
        error: !result,
        message: result ? "Create success" : "Create failed",
      };
      return res.status(200).json(message);
    } catch (error) {
      this.messageError();
    }
  }

  async handleGetAllCategory(req, res) {
    try {
      const result = await CategoryModel.findAllCategory();
      return res.status(200).json({
        error: false,
        data: result,
      });
    } catch (error) {
      this.messageError(res);
      //   console.log(error);
    }
  }

  async handleUpdateProduct(req, res) {
    try {
      const data = req.body;
      const result = await ProductModel.updateProduct(data);
      const message = {
        error: !result,
        message: result ? "Update product success" : "Update product failed",
      };
      return res.json(message);
    } catch (error) {
      this.messageError(res);
    }
  }

  async handleDeleteProduct(req, res) {
    try {
      const { id } = req.query;
      const result = await ProductModel.updateProduct({ _id: id, status: 0 });
      const message = {
        error: !result,
        message: result ? "Delete success" : "Delete failed",
      };
      return res.json(message);
    } catch (error) {
      this.messageError(res);
    }
  }
}

module.exports = new ProductController();
