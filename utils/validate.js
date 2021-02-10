//import React from "react";

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

const CheckInput = (inputToCheck) => {
  let validInput = inputToCheck.trim().length >= 4;
  if (validInput) {
    return true;
  } else {
    return false;
  }
};

exports.CheckForInvalidCharacters = (dataToCheck) => {
  let invalidCharacters = [
    ">",
    "<",
    "{",
    "}",
    "?",
    "!",
    "$",
    "#",
    "/",
    "|",
    "&",
    "\b",
    "\t",
    ";",
  ];
  let invalidInput = invalidCharacters.map((c) => dataToCheck.includes(c));
  if (invalidInput.includes(true)) {
    // console.log("wrong input");
    return false;
  } else {
    return true;
  }
};
