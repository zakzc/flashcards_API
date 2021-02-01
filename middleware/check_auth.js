const HttpError = require("../models/http_error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // authorization: " Bearer TOKEN"
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Authentication failed. No token. Error 09.", 401);
    }
    const decodedToken = jwt.verify(token, "initial_secret");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed. error 15.", 401);
    return next(error);
  }
};
