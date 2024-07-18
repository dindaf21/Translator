require("dotenv").config({ path: `${process.cwd()}/.env` });

// require('dotenv').config(); // ini dikomentar

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres", // mysql
    logging: false,
    seederStorage: "sequelize",
    "migrations-path": "db/migrations",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres", // mysql
    "migrations-path": "db/migrations",
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "migrations-path": "db/migrations",
    logging: false
  }
};