const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const Account = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    address: { type: String },
    phoneNumber: {
      type: String,
    },
    email: { type: String },
    role: { type: String, default: "USER_ROLE" },
    status: {
      type: Number,
      default: 0,
    },
    accessToken: { type: String, default: "" },
  },
  { timestamps: true }
);

class AccountModel {
  init() {
    return mongoose.model("Account", Account);
  }

  async upadateFieldAccount(obj) {
    const model = this.init();
    const { _id, ...data } = obj;
    const result = await model
      .updateOne({ _id }, data)
      .then(() => true)
      .catch(() => false);
    return result;
  }

  async findOneAccountByParam(obj) {
    const model = this.init();
    return await model.findOne({ ...obj, status: 0 });
  }

  async createAccount(obj) {
    const model = this.init();
    const account = new model(obj);
    const result = await account
      .save()
      .then((res) => true)
      .catch((err) => false);
    return result;
  }
}

module.exports = new AccountModel();
