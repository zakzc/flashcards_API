const { contextsKey } = require("express-validator/src/base");
const {
  validateEmail,
  validatePasswordInput,
  CheckForInvalidCharacters,
} = require("../utils/validate");

describe("Validation tests", () => {
  test("Check for invalid input", () => {
    expect(CheckForInvalidCharacters("wrong!string")).toEqual(false);
  });
  test("Check for valid input", () => {
    expect(CheckForInvalidCharacters("correct")).toEqual(true);
  });
});
