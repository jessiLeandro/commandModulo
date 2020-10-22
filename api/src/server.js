const app = require("./app");
const db = require("./database");
const errorFormatter = require("./helpers/errors/formatter");

db.authenticate().then(() => {
  const { PORT } = process.env;

  app.use((err, req, res, next) => {
    console.error(err.stack || err);
    console.error(JSON.stringify(err));
    const formattedError = errorFormatter(err);

    res.status(formattedError.status || 500);
    res.json(formattedError);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
