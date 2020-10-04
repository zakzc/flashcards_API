const { get } = require("got");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
// model imports
const HttpError = require("../models/http_error");
const SetOfCards = require("../models/cardsModel");

let DUMMY_Stack = [
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

async function addStack(req, res, next) {
  console.log(req.body);
  const { stackName, createdBy, cards } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("error on data validation for add stack request", 422);
  }
  // * previous API only implementation
  //   const newStackCreated = {
  //     id: uuidv4(),
  //     stackName,
  //     createdBy,
  //     cards,
  //   };
  // with saving to local dummy variable
  //   DUMMY_Stack.push(newStackCreated);
  //   console.log("Received post, added", newStackCreated);
  //   res.status(201).json({ Added: newStackCreated });
  // }
  // * implementation with Mongoose
  const newStackCreated = new SetOfCards({
    stackName,
    createdBy,
    cards,
  });

  try {
    await newStackCreated.save();
  } catch (err) {
    const error = new HttpError("Error on adding new stack", 500);
    return next(error);
  }

  res.status(201).json({ stack: newStackCreated });
}

function updateStack(req, res, next) {
  const { stackName, createdBy, cards } = req.body;
  const stackNo = req.params.No;
  // data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("error on data validation for update request", 422);
  }
  /// finding element to update
  const updatedStack = { ...DUMMY_Stack.find((u) => u.id === stackNo) };
  // creating a full version of the stack data before updating
  const indexOfChange = DUMMY_Stack.find((u) => u.id === stackNo);
  updatedStack.id = stackNo;
  updatedStack.stackName = stackName;
  updatedStack.createdBy = createdBy;
  updatedStack.cards = cards;
  // now the actual update
  DUMMY_Stack[stackNo] = updatedStack;
  console.log("Updated: ", DUMMY_Stack);
  res.status(200).json({ Updated: updatedStack });
}

function deleteStack(req, res, next) {
  const itemToDelete = req.params.No;
  if (!DUMMY_Stack.find((f) => f.id === itemToDelete)) {
    throw new HttpError("No item found for deletion", 401);
  }
  DUMMY_Stack = DUMMY_Stack.filter((f) => f.id !== itemToDelete);
  console.log("Deleted item: ", itemToDelete);
  res.status(200).json({ Deleted: itemToDelete });
}

//TODO don't forget to add, later, the function that adds the
//TODO unique id to the list of stacks owned by users in the users json

// export of CRUD functions
exports.getStackByID = getStackByID;
exports.addStack = addStack;
exports.updateStack = updateStack;
exports.deleteStack = deleteStack;
