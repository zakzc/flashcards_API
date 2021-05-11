// node modules import
const express = require("express");
const bodyParser = require("body-parser");
// const app = express();
const HttpError = require("../models/http_error");
// routes
const cardRoutes = require("../routes/cardRoutes");
const userRoutes = require("../routes/userRoutes");

module.exports = function (app) {
  // app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Necessary step to avoid CORS error on API requests
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  });

  app.use("/cardApi", cardRoutes);

  app.use("/userApi", userRoutes);

  app.use((req, res, next) => {
    const error = new HttpError("This route was not found", 404);
    throw error;
  });

  // Error handling
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res
      .status(error.code || 500)
      .json({ message: error.message || "unknown error occurred" });
  });
};
