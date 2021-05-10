"use strict";

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      "user",
      [
        {
          id: 1,
          username: "admin",
          password:
            "$2y$10$7icgwizIixfazS.jwl12MeWEaLSQrvFXs13/z1lTx2YJAErd9L6Y.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete("user", null, {}),
};
