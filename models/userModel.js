const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  userEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userStacks: { type: Object },
});

// complements the unique parameter in the userEmail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("listOfUsers", userSchema);
