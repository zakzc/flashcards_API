const HashTest = require("../utils/hashPsw");

describe("Password hashing", () => {
  test("Check if hash is returning data.", () => {
    expect.assertions(1);
    const testHash = HashTest("test");
    expect(testHash).toBeTruthy();
  });
});
