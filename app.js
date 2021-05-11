// node modules import
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// DB module
const mongoose = require("mongoose");
// file imports
const cardRoutes = require("./api/routes/cardRoutes");
const userRoutes = require("./api/routes/userRoutes");
// model imports
const HttpError = require("./api/models/http_error");

require("./api/startUp/db_connection")(app);

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

// config();
// const uri = process.env.MONGO_URL;
// console.log("uri is: ", uri);
// console.log("check: ", process.env.MONGO_URL);

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log("Server is listening");
//     app.listen(process.env.PORT || 5000);
//   })
//   .catch((err) => {
//     console.log("Error trying to connect to MongoDB", err);
//   });

//
