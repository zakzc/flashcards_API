exports.CheckInput = (inputToCheck) => {
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
    return false;
  } else {
    return true;
  }
};
