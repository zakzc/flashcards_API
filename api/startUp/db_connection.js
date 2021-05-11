const mongoose = require("mongoose");
//
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const uri = process.env.MONGO_URL;

module.exports = function (app) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Server is listening");
      app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
      console.log("Error trying to connect to MongoDB", err);
    });
};
