const Sequelize = require("sequelize");
const models = require("./models");

// Option 1: Passing parameters separately
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  dialect: "mysql",
  define: {
    freezeTableName: true,
    paranoid: true,
  },
  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
    acquire: 1000000,
  },
});

const modelInstances = models && models.map((model) => model(sequelize));
modelInstances.forEach(
  (modelInstance) =>
    modelInstance.associate && modelInstance.associate(sequelize.models)
);

module.exports = sequelize;
