const AccountModel = require("../Models/account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = process.env.SALTROUNDS_BCRYPT;

require("dotenv/config");

class AccountController {
  async handleCreeteAccount(req, res) {
    const { username, password, email, phoneNumber, address } = req.body;
    const role = "USER_ROLE";
    let result = false;
    const newPassword = await bcrypt.hash(password, +saltRounds);
    const check = await AccountModel.findOneAccountByParam({ username, role });
    if (!check) {
      result = await AccountModel.createAccount({
        username,
        password: newPassword,
        email,
        phoneNumber,
        address,
      });
    }
    const message = {
      error: !result,
      message: result ? "Create account success" : "Create account failed",
    };
    return res.json(message);
  }

  async handleLogin(req, res) {
    const { username, password, role } = req.body;
    // console.log({});
    let result = false;
    let token = "";
    let refreshToken = "";
    const find = await AccountModel.findOneAccountByParam({ username, role });
    let id = "";

    if (find) {
      result = await bcrypt.compare(password, find.password);
      const { _id, username, role } = find;
      if (result) {
        token = jwt.sign({ _id, username, role }, process.env.JWT_SECRET_KEY, {
          expiresIn: "30s",
        });
        refreshToken = jwt.sign(
          { _id, username, role },
          process.env.JWT_SECRET_KEY
        );
        await AccountModel.upadateFieldAccount({
          _id,
          accessToken: refreshToken,
        });
      } else {
        return res.json({
          error: true,
          message: "Password incorrect",
        });
      }
    } else {
      return res.json({
        error: true,
        message: "Username incorrect",
      });
    }

    const message = {
      error: !result,
      token,
    };
    return res.json(message);
  }

  async handleLogout(req, res) {
    const { _id } = req.body;
    await AccountModel.upadateFieldAccount({ _id, accessToken: "" });
    return res.status(200).json({ err: false });
  }

  async handleRefreshToken(req, res) {
    const { _id } = req.query;
    const result = await AccountModel.findOneAccountByParam({ _id });
    if (result) {
      jwt.verify(
        result.accessToken,
        process.env.JWT_SECRET_KEY,
        (err, data) => {
          if (err) return res.json({ err: true, message: "Can not verify..." });
          const { _id, username, role } = data;
          const newToken = jwt.sign(
            { _id, username, role },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "30s",
            }
          );
          return res.json({ token: newToken });
        }
      );
    }
  }

  async handleGetTokenRefresh(req, res) {
    try {
      // const token
    } catch (error) {}
  }

  async handleAuthorization(req, res) {
    try {
      const { user_id, role } = req.body;
      const result = await AccountModel.upadateFieldAccount({
        _id: user_id,
        role,
      });
      const message = {
        error: !result,
        message: result ? "Update success" : "Update failed",
      };
      return res.json(message);
    } catch (error) {
      console.log(error);
    }
  }

  async handleDeteleAccount(req, res) {
    try {
      const { id } = req.query;
      const result = await AccountModel.upadateFieldAccount({
        _id: id,
        status: 1,
      });
      const message = {
        error: !result,
        message: result ? "Detete acount success" : "Delete account failed",
      };
      return res.json(message);
    } catch (error) {
      console.log(error);
    }
  }

  async handleGetProfile(req, res) {
    try {
      const { _id } = req.user;
      const result = await AccountModel.findOneAccountByParam({ _id });
      const { username, phoneNumber, email, address, createdAt, updatedAt } =
        result;
      return res.json({
        _id: result._id,
        username,
        phoneNumber,
        email,
        address,
        createdAt,
        updatedAt,
      });
    } catch (error) {}
  }
}

module.exports = new AccountController();
