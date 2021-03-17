const bcrypt = require("bcryptjs");
// model imports
const HttpError = require("../models/http_error");

async function hashPsw(password) {
  let hashedPsw;
  try {
    hashedPsw = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Error on password processing", 500);
    return next(error);
  }
  if (hashedPsw) {
    return hashedPsw;
  } else {
    return false;
  }
}

module.exports = hashPsw;
