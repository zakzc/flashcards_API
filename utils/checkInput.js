const { CheckForInvalidCharacters, CheckInput } = require("./checks");
const { validateEmail, validatePasswordInput } = require("./validate");

function checkInput(userEmail, password, firstName, lastName) {
  ////* Sequence of checks and validations ////
  if (
    validateEmail(userEmail) === false ||
    validatePasswordInput(password) === false ||
    CheckForInvalidCharacters(firstName) === false ||
    CheckForInvalidCharacters(lastName) === false ||
    CheckInput(firstName) === false ||
    CheckInput(lastName) === false
  ) {
    return false;
  } else {
    return true;
  }
}

module.exports = checkInput;
