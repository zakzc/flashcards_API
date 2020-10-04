// node modules import
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// DB module
const mongoose = require("mongoose");
// file imports
const cardMan = require("./routes/cardMan");
const userMan = require("./routes/userMan");
// model imports
const HttpError = require("./models/http_error");

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/cardApi", cardMan);

app.use("/userApi", userMan);

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
    "mongodb+srv://zak:XG4lGCacJqq6cFKH@cluster0.ybfne.gcp.mongodb.net/<Flashcards>?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log("Connection error: ", err);
  });
