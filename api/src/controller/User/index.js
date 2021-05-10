const database = require("../../database");
// const Chip = database.model("chip");
const userDomain = require("../../Domain/User");
const R = require("ramda");

class UserController {
  async create(req, res, next) {
    const transaction = await database.transaction();
    try {
      const user = await userDomain.create(req.body, { transaction });

      await transaction.commit();
      res.json(user);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    const transaction = await database.transaction();
    try {
      const user = await userDomain.updatePassword(req.body, { transaction });

      await transaction.commit();
      res.json(user);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}

module.exports = new UserController();
