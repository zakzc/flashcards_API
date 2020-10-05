const { get } = require("got");
const { v4: uuidv4 } = require("uuid");
// validation
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

async function getStackByID(req, res, next) {
  const stackId = req.params.No;
  // * previous implementation
  // const returnStack = DUMMY_Stack.find((c) => {
  //   return c.id === stackId;
  // });
  let returnStack;
  try {
    returnStack = await SetOfCards.findById(stackId);
  } catch (err) {
    const error = new HttpError("Error on getting stack by id: ", 500);
    return next(error);
  }
  if (!returnStack) {
    const error = new HttpError("no data found on Card API", 404);
    return next(error);
  } else {
    res.json({ stack: returnStack.toObject({ getters: true }) });
  }
}

// ! to be implemented should I search by 'created by' or by user id?
async function getStacksByUser(req, res, next) {
  const creator = req.params.uid;
  let creatorStacks;
  try {
    // later, instead of createdBy, the search will be by user ID
    creatorStacks = await SetOfCards.find({ createdBy: uid });
    console.log(creator);
  } catch (err) {
    const error = new HttpError("Failed to obtain a result", 500);
  }
  if (!creatorStacks || creatorStacks.length === 0) {
    return next(
      new HttpError("Could not find any stack associated with this user"),
      404
    );
  }
  res.json(
    {
      stacks: creatorStacks.map((t) => {
        t.toObject({ getters: true });
      }),
    },
    200
  );
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

async function updateStack(req, res, next) {
  // const stackNo = req.params.No;
  // data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for update request", 422)
    );
  }
  const { stackName, createdBy, cards } = req.body;
  const stackId = req.params.No;
  let updatedStack;
  try {
    updateStack = await SetOfCards.findById(stackId);
  } catch (err) {
    const error = new HttpError(
      "Could not update place. Place not found.",
      500
    );
    return next(error);
  }
  // previous implementation
  /// finding element to update
  // const updatedStack = { ...DUMMY_Stack.find((u) => u.id === stackNo) };
  // creating a full version of the stack data before updating
  // Previous implementation
  // const indexOfChange = DUMMY_Stack.find((u) => u.id === stackNo);
  // updatedStack.id = stackNo;
  updatedStack.stackName = stackName;
  updatedStack.createdBy = createdBy;
  updatedStack.cards = cards;
  // now the actual update
  // previous implementation
  // DUMMY_Stack[stackNo] = updatedStack;
  // console.log("Updated: ", DUMMY_Stack);
  try {
    await updateStack.save();
  } catch (err) {
    const error = new HttpError("Update operation failed", 500);
    return next(error);
  }
  res.status(200).json({ Updated: updatedStack.toObject({ getters: true }) });
}

async function deleteStack(req, res, next) {
  const itemToDelete = req.params.No;
  let stackToDelete;
  try {
    stackToDelete = await SetOfCards.findById(itemToDelete);
  } catch (err) {
    const error = new HttpError("Could not find item to delete.", 500);
    return next(error);
  }
  try {
    await stackToDelete.remove();
  } catch (err) {
    const error = new HttpError("Delete operation failed", 500);
    return next(error);
  }
  // previous implementation
  // if (!DUMMY_Stack.find((f) => f.id === itemToDelete)) {
  //   throw new HttpError("No item found for deletion", 401);
  // }
  // DUMMY_Stack = DUMMY_Stack.filter((f) => f.id !== itemToDelete);

  console.log("Deleted item: ", itemToDelete);
  res.status(200).json({ Deleted: itemToDelete });
}

//TODO don't forget to add, later, the function that adds the
//TODO unique id to the list of stacks owned by users in the users json

// export of CRUD functions
exports.getStackByID = getStackByID;
exports.getStacksByUser = getStacksByUser;
exports.addStack = addStack;
exports.updateStack = updateStack;
exports.deleteStack = deleteStack;
