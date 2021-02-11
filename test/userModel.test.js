/**
 * @jest-environment node
 */

const userSchema = require("../models/userModel");
const mongoose = require("mongoose");

describe("User Model", () => {
  test("hashing of password?", async () => {
    // await mongoose.connect("");
    expect(true).toBe(true);
  });
});
