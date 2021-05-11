const HttpError = require("../models/http_error");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  // Options is a std browser method, activated on anything other than GET
  // in order to check what is it that the server allows as request.
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    // The convention is:
    // authorization: " Bearer TOKEN"
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpError("Authentication failed. No token (error 15).", 401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    logger.error("NOT authorized");
    const error = new HttpError("Authentication failed (error 21).", 401);
    return next(error);
  }
};
