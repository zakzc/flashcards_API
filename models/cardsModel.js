const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  stackName: { type: String, required: true },
  createdBy: { type: String, required: true },
  cards: { type: Object, required: true },
});

module.exports = mongoose.model("SetOfCards", cardSchema);
