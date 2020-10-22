const routes = require("express").Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const authMiddleware = require("../middleware/auth");
const SessionController = require("../controller/Session");
const ChipRoutes = require("./ChipRoutes");
const SonoffRoutes = require("./SonoffRoutes");
const UserRoutes = require("./UserRoutes");

routes.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

routes.post(bodyParser.json());

const corsOptionsSessions = {
  origin: process.env.ORIGIN,
};

routes.post("/sessions", cors(corsOptionsSessions), SessionController.login);

routes.use(authMiddleware);

routes.use("/sonoff", SonoffRoutes);

routes.use(cors(corsOptionsSessions));

routes.use("/user", UserRoutes);
routes.use("/chip", ChipRoutes);

module.exports = routes;
