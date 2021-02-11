const { validateEmail, validatePasswordInput } = require("../utils/validate");
const { CheckForInvalidCharacters, CheckInput } = require("../utils/checks");

const checkChar = jest.fn(CheckForInvalidCharacters);
const checkIn = jest.fn(CheckInput);

describe("Utilities - Validation", () => {
  checkChar.mockReturnValueOnce(true);
  checkIn.mockReturnValueOnce(true);
  test("Test email validation", () => {
    expect(validateEmail("test@testme.com")).toBe(true);
  });
  test("Test password validation", () => {
    expect(validatePasswordInput("correct")).toBe(true);
  });
});

describe("Utilities - Counter Test", () => {
  checkChar.mockReturnValueOnce(true);
  checkIn.mockReturnValueOnce(true);
  test("Test email validation", () => {
    expect(validateEmail("testMe.com")).toBe(false);
  });
  test("Test password validation", () => {
    expect(validatePasswordInput("")).toBe(false);
  });
});
