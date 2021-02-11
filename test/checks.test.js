const { CheckForInvalidCharacters, CheckInput } = require("../utils/checks");

describe("Utilities - Checks", () => {
  describe("Check for characters", () => {
    test("Check for invalid input data", () => {
      expect(CheckForInvalidCharacters("wrong!string")).toEqual(false);
    });
    test("Check for valid input data", () => {
      expect(CheckForInvalidCharacters("correct")).toEqual(true);
    });
  });

  describe("Check Input", () => {
    test("Check for invalid input", () => {
      expect(CheckInput("no")).toEqual(false);
    });
    test("Check for valid input", () => {
      expect(CheckInput("this_is_a_correct_input")).toEqual(true);
    });
  });
});
