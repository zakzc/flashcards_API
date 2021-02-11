// my validation
const {
  CheckForInvalidCharacters,
  validateEmail,
  validatePasswordInput,
} = require("./validate");

function checkInput(userEmail, password, firstName, lastName) {
  ////* Sequence of checks ////
  // new validation
  if (
    validateEmail(userEmail) === false ||
    validatePasswordInput(password) === false ||
    (CheckForInvalidCharacters(firstName) ===
      falseCheckForInvalidCharacters(lastName)) ===
      false
  ) {
    return false;
  } else {
    return true;
  }
}

module.exports = checkInput;
