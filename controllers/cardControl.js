const { get } = require("got");
// model imports
const HttpError = require("../models/http_error");

const debugStackAPI = true;

const DUMMY_Stack = [
  {
    id: "s000",
    stackName: "test stack",
    createdBy: "Steinbeck",
    cards: { front: "front of the card", back: "back of the same card" },
  },
  {
    id: "s001",
    stackName: "2nd stack",
    createdBy: "Hemingway",
    cards: { front: "for whom the bells toll", back: "they toll for you" },
  },
  {
    id: "s002",
    stackName: "Another test",
    createdBy: "Steinbeck",
    cards: { front: "wines", back: "of wrath" },
  },
];

function getStackByID(req, res, next) {
  const stackId = req.params.No;
  if (debugStackAPI) {
    console.log("GET request in Card management for stack:", stackId);
  }
  const returnStack = DUMMY_Stack.find((c) => {
    return c.id === stackId;
  });
  if (!returnStack) {
    throw new HttpError("no data found on Card API", 404);
  } else {
    res.json(returnStack);
  }
}

function addStack(req, res, next) {
  console.log(req.body);
  const { id, stackName, createdBy, cards } = req.body;
  const newStackCreated = {
    id,
    stackName,
    createdBy,
    cards,
  };
  DUMMY_Stack.push(newStackCreated);
  console.log("Received post, added", newStackCreated);
  res.status(201).json({ added: newStackCreated });
}

exports.getStackByID = getStackByID;
exports.addStack = addStack;
