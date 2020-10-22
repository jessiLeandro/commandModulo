const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const R = require("ramda");

const bcrypt = require("bcryptjs");

const getHash = (plainPassoword) => bcrypt.hash(plainPassoword, 10);

const shouldMakeAHash = (user) => user.changed("password");

const makeHashPasswordHook = async (user) => {
  if (shouldMakeAHash(user)) {
    user.password = await getHash(user.password);
  }
};

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      set(oldValue) {
        const newValue = R.trim(oldValue);
        this.setDataValue("username", newValue);
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  user.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  user.prototype.generateToken = function () {
    return jwt.sign(
      {
        id: this.id,
        iat: Math.floor(Date.now() / 1000) - 30,
        // exp: Math.floor(moment()) / 1000,
        // exp: Math.floor(moment("01012120", "DDMMYYYY").endOf("day")) / 1000,
        exp: Math.floor(moment().endOf("day")) / 1000,
      },
      process.env.APP_SECRET
    );
  };

  user.beforeCreate(makeHashPasswordHook);
  user.beforeUpdate(makeHashPasswordHook);

  return user;
};
