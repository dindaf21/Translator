"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "localization",
      [
        {
          key: "good",
          translated_text: "bagus",
          to_locale: "id",
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          key: "bad",
          translated_text: "buruk",
          to_locale: "id",
          createdBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("localization", null, {});
  },
};
