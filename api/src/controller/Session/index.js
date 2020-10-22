const database = require("../../database");
const User = database.model("user");
const R = require("ramda");

class SessionController {
  async login(req, res) {
    const transaction = await database.transaction();

    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      transaction,
    });

    if (!user) {
      return res
        .status(401)
        .json({ fieldError: "username", message: "Usuário não encontrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(401)
        .json({ fieldError: "password", message: "Senha icorreta" });
    }

    return res.status(200).json({
      user: R.omit(["password"], JSON.parse(JSON.stringify(user))),
      token: user.generateToken(),
    });
  }
}

module.exports = new SessionController();
