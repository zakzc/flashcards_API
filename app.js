// node modules import
const express = require("express");
const bodyParser = require("body-parser");
// file imports
const cardMan = require("./routes/cardMan");
const users = require("./routes/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/cardApi/cards", cardMan);

app.use("/userApi", users);

app.post((req, res, next) => {
  res.send("received a post requetst");
});

app.get((req, res, next) => {
  console.log("Connection request at port 5000");
  res.send("Success: 200");
});

app.listen(5000);
