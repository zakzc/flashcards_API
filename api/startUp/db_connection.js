const mongoose = require("mongoose");

//
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const logger = require("../utils/logger");
///
const uri = process.env.MONGO_URL;

module.exports = function (app) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      logger.info("Server is listening");
      app.listen(process.env.PORT || 5000);
    })
    .catch((err) => {
      logger.error("Error trying to connect to MongoDB", err);
    });
};
