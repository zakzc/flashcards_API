const HashTest = require("../utils/hashPsw");

describe("Password hashing", () => {
  test("Check if hash is returning data.", () => {
    expect.assertions(1);
    const testHash = HashTest("test");
    const regExHash = new RegExp(/w+/);
    return expect(testHash).resolves.toMatch(regExHash);
  });
});
