const { CheckForInvalidCharacters, CheckInput } = require("../utils/checks");

exports.validateEmail = (eMail) => {
  // no input
  if (!CheckInput(eMail) === true) {
    return false;
  } else {
    // invalid characters
    if (CheckForInvalidCharacters(eMail) === false) {
      return false;
    } else {
      // email formatting
      // backspace has to be doubled, since it is inside a string
      //let pattern = new RegExp("^\\w+@\\w+.\\w+$");
      const pattern = /^\w+@\w+\.\w+$/;
      if (pattern.test(eMail) === false) {
        return false;
      } else {
        return true;
      }
    }
  }
};

exports.validatePasswordInput = (pswInput) => {
  if (CheckInput(pswInput) === true) {
    if (CheckForInvalidCharacters(pswInput) === true) {
      return true;
    }
  }
  return false;
};
