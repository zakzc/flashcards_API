const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  stackName: { type: String, required: true },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "listOfUsers",
  },
  cards: { type: Object, required: true },
});

module.exports = mongoose.model("SetOfCards", cardSchema);
