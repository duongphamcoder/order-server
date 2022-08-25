const jwt = require("jsonwebtoken");
require("dotenv/config");
const midleAuthorization = {
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    let isLogin = true;
    if (!token) {
      isLogin = false;

      return res.json({
        err: true,
        message: "Please login to do this",
        isLogin,
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
        if (err) {
          console.log("error", err);
          return res.json({
            err: true,
            message: "Can not verify token",
            isLogin,
          });
        }
        req.user = data;
        console.log("Req.user", req.user);
        next();
      });
    }
  },

  verifyAdmin: (req, res, next) => {
    midleAuthorization.verifyToken(req, res, () => {
      if (req.user.role === "USER_ROLE") {
        return res.json({ error: true, message: "You are not authorized" });
      }
      next();
    });
  },
};

module.exports = midleAuthorization;
