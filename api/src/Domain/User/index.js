const R = require("ramda");
const database = require("../../database");
const User = database.model("user");
const { FieldValidationError } = require("../../helpers/errors");

class UserDomain {
  async create(body, options = {}) {
    const { transaction = null } = options;

    const user = body;

    let error = false;

    const fielError = [],
      message = [];

    const userNotHasProp = (prop) => R.not(R.has(prop, user));

    if (userNotHasProp("username") && !user.username) {
      fielError.push("username");
      message.push("username cannot null");
      error = true;
    } else if (
      await User.findOne({ where: { username: user.username }, transaction })
    ) {
      fielError.push("username");
      message.push("username já foi cadastrado");
      error = true;
    }

    if (userNotHasProp("password") && !user.password) {
      fielError.password = true;
      message.password = "password cannot null";
      error = true;
    } else {
      user.password = R.trim(user.password);
    }

    if (error) {
      throw new FieldValidationError({ fielError, message });
    }

    return await User.create(user, { transaction });
    // return { teste: "success" };
  }

  async updatePassword(body, options = {}) {
    const { transaction = null } = options;

    const hasProp = (prop) => R.has(prop, body);

    let error = false;
    let user = null;

    const fielError = [],
      message = [];

    if (hasProp("username") && !body.username) {
      fielError.push("username");
      message.push("username cannot null");
      error = true;
    }

    if (hasProp("id") && !body.id) {
      fielError.push("id");
      message.push("id cannot null");
      error = true;
    } else {
      user = await User.findByPk(body.id, { transaction });

      if (!user) {
        fielError.push("id");
        message.push("id invalid");
        throw new FieldValidationError({ fielError, message });
      } else if (user.username !== body.username) {
        fielError.push("username");
        message.push("username não está atrelado ao id");
        throw new FieldValidationError({ fielError, message });
      }
    }

    if (hasProp("password") && !body.password) {
      fielError.push("password");
      message.push("password cannot null");
      error = true;
    }

    if (hasProp("newPassword") && !body.newPassword) {
      fielError.push("newPassword");
      message.push("newPassword cannot null");
      error = true;
    }

    if (hasProp("confirfNewPassword") && !body.confirfNewPassword) {
      fielError.push("confirfNewPassword");
      message.push("confirfNewPassword cannot null");
      error = true;
    }

    if (error) {
      throw new FieldValidationError({ fielError, message });
    }

    if (!(await user.checkPassword(body.password))) {
      fielError.push("password");
      message.push("senha incorreta");
      error = true;
    }

    if (body.newPassword !== body.confirfNewPassword) {
      fielError.push("confirfNewPassword");
      message.push("senha diferente");
      error = true;
    }

    if (error) {
      throw new FieldValidationError({ fielError, message });
    }

    return user.update({ password: body.newPassword }, { transaction });
  }
}
module.exports = new UserDomain();
