// node modules import
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// file imports
const cardMan = require("./routes/cardMan");
const users = require("./routes/users");

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/cardApi", cardMan);

app.use("/userApi", users);

// Error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "unknown error occurred" });
});

app.listen(5000);
