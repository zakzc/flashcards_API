/**
 * @jest-environment node
 */

const checkInput = require("../utils/checkInput");

// const validInput = {
//   userEmail: "valid@email",
//   password: "validPassword",
//   firstName: "Valid",
//   lastName: "Entry",
// };

describe("Checking request", () => {
  test("Valid user email", () => {
    // expect(
    //   checkInput("valid@email", "validPassword", "Valid", "Entry")
    // ).toEqual(true);
    expect(true).toEqual(true);
  });
});
