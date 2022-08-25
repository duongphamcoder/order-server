require("dotenv/config");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const routes = require("./main/routes/main");

const connectServer = (app) => {
  try {
    mongoose
      .connect(`${process.env.CONNECT_MONGOOSE}`)
      .then((res) => {
        app.listen(PORT, () => {
          console.log("Connect server success!!!");
          routes(app);
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectServer;
