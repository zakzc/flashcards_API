// node modules import
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// DB module
const mongoose = require("mongoose");
// file imports
const cardRoutes = require("./routes/cardRoutes");
const userRoutes = require("./routes/userRoutes");
// model imports
const HttpError = require("./models/http_error");

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/cardApi", cardRoutes);

app.use("/userApi", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Route not found", 404);
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

mongoose
  .connect(
    "mongodb+srv://zak:XG4lGCacJqq6cFKH@cluster0.ybfne.gcp.mongodb.net/<Flashcards>?authSource=admin?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log("Connection error: ", err);
  });
