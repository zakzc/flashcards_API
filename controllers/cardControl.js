const { get } = require("got");
const { v4: uuidv4 } = require("uuid");
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
    id: uuidv4(),
    stackName,
    createdBy,
    cards,
  };
  DUMMY_Stack.push(newStackCreated);
  console.log("Received post, added", newStackCreated);
  res.status(201).json({ added: newStackCreated });
}

function updateStack(req, res, next) {
  const { id, stackName, createdBy, cards } = req.body;
  const stackNo = req.params.No;
  const updatedStack = { ...DUMMY_Stack.find((u) => u.id === stackNo) };
  // creating a full version of the stack data before updating
  const indexOfChange = DUMMY_Stack.find((u) => u.id === stackNo);
  updatedStack.stackName = stackName;
  updatedStack.createdBy = createdBy;
  updatedStack.cards = cards;
  // now the actual update
  DUMMY_Stack[stackNo] = updatedStack;
  console.log("Updated: ", updatedStack);
  res.status(200).json({ updated: updatedStack });
}

function deleteStack(req, res, next) {}

//TODO don't forget to add, later, the function that adds the
//TODO unique id to the list of stacks owned by users in the users json

// export of CRUD functions
exports.getStackByID = getStackByID;
exports.addStack = addStack;
exports.updateStack = updateStack;
exports.deleteStack = deleteStack;
