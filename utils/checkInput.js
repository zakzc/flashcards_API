// my validation
const {
  CheckForInvalidCharacters,
  validateEmail,
  validatePasswordInput,
} = require("./validate");

function checkInput(userEmail, password, firstName, lastName) {
  ////* Sequence of checks ////
  // new validation
  if (validateEmail(userEmail) === false) {
    // const error = new HttpError("This is not a valid email", 422);
    // return next(error);
    return false;
  }
  if (validatePasswordInput(password) === false) {
    // const error = new HttpError("This is not a valid password", 422);
    // return next(error);
    return false;
  }
  if (CheckForInvalidCharacters(firstName) === false) {
    // const error = new HttpError("This entry contains invalid characters", 422);
    // return next(error);
    return false;
  }
  if (CheckForInvalidCharacters(lastName) === false) {
    // const error = new HttpError("This entry contains invalid characters", 422);
    // return next(error);
    return false;
  }
  return true;
}

module.exports = checkInput;
