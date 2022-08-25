const ProductModel = require("../Models/product");
const CategoryModel = require("../Models/category");
const CartModel = require("../Models/cart");
class APIController {
  async index(req, res) {
    try {
      const categorys = await CategoryModel.findAllCategory();
      const promises = categorys.map((item, index) => {
        const { _id } = item;
        return ProductModel.findAllProductByCategoryWithLimit(_id, 6);
      });
      const result = await Promise.all(promises);
      let data = {};
      result.forEach((item, index) => {
        data[`${categorys[index]._id}`] = item.map((item2, index2) => {
          const { _id, name, price, category_id, photoURL } = item2;
          return {
            _id,
            name,
            price,
            category_id,
            photoURL,
            quantity: 1,
          };
        });
      });
      const respone = {
        categorys,
        data,
      };
      return res.json(respone);
    } catch (error) {
      console.log(error);
    }
  }

  // phân trang cho order
  async pagination(req, res) {
    try {
      const { category, page } = req.query;
      const result = await ProductModel.findAllProductByCategory(category);
      const quantity = 6;
      /**
       * lấy ra sản phẩm theo chỉ mục
       *  và trả về một mảng dữ liệu cần lấy
       */
      const queryProduct = (page) => {
        let start = 0;
        let end = quantity;
        // kiểm trang trang hiện tại có khác 1 hay không
        // những trang khác 1 sẽ được tính theo công thức dưới
        if (+page !== 1) {
          start = (+page - 1) * quantity;
          end = +page * quantity;
        }
        let arr = [];
        for (let index = start; index < end; index++) {
          if (result[index]) {
            arr.push(result[index]);
          }
        }
        return arr;
      };

      const data = queryProduct(page);
      // kiểm tra xem vị trí trang hiện tại có hợp lệ hay không
      const currentPage = data.length !== 0;
      if (currentPage) {
        const respone = data;
        /**
         * kiểm tra xem có được chuyển tiếp hay quay lại không
         */
        const prev = +page !== 1;
        const next = queryProduct(+page + 1).length !== 0;
        return res.json({
          error: !currentPage,
          next,
          prev,
          data: respone,
        });
      }
      return res.json({
        error: !currentPage,
        data: [],
        redirect: 1,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new APIController();
