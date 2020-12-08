const { get } = require("got");
// const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
// model imports
const HttpError = require("../models/http_error");
const SetOfCards = require("../models/cardsModel");
const listOfUsers = require("../models/userModel");
// validation imports
const { validationResult } = require("express-validator");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const { selectFields } = require("express-validator/src/select-fields");

async function getStackByID(req, res, next) {
  const stackId = req.params.No;
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
    res.json(returnStack.toObject({ getters: true }));
  }
}

// ! to be updated
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

async function addNewStack(req, res, next) {
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for add stack request", 422)
    );
  }
  // assignment
  const { stackName, createdBy, cards } = req.body;
  const newStackCreated = new SetOfCards({
    stackName,
    createdBy,
    cards,
  });
  console.log("new to create: ", newStackCreated);
  // connection to user DB to retrieve the name of the user who created this stack
  let currentUser;
  try {
    // is the current user in memory already?
    currentUser = await listOfUsers.findById(createdBy);
    console.log("user is ", currentUser);
  } catch (err) {
    const error = new HttpError("No current user: " + currentUser, 500);
    return next(error);
  }
  // is there any user logged in?
  if (!currentUser) {
    const error = new HttpError("No user logged in or user doesn't exist", 404);
    return next(error);
  }
  console.log("user is ", currentUser);
  // saving process
  console.log("to add: ", newStackCreated);
  let newStackToUser = {
    stack_id: newStackCreated._id,
    stack_name: newStackCreated.stackName,
  };
  console.log("to be added to user stacks: ", newStackToUser);
  try {
    // * Parallel DB processes using session:
    // both operations: add created by (author) to Stack and add Stack to User data
    // are atomic. For that, we need mongoose transaction and session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newStackCreated.save({ session: sess });
    currentUser.userStacks.push(newStackToUser);
    await currentUser.save({ session: sess });
    await sess.commitTransaction();
    //// *
  } catch (err) {
    const error = new HttpError("Error on adding new stack", 500);
    console.log("-------- Error: --------- \n", err);
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
  updatedStack.stackName = stackName;
  updatedStack.createdBy = createdBy;
  updatedStack.cards = cards;
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
  console.log("for deletion: ", itemToDelete);
  let stackToDelete;
  try {
    stackToDelete = await SetOfCards.findById(itemToDelete).populate(
      "createdBy"
    );
    // stackToDelete = await SetOfCards.findById(itemToDelete);
    console.log("stack to delete: ", stackToDelete);
  } catch (err) {
    const error = new HttpError("Could not find item to delete.", 500);
    return next(error);
  }
  if (!stackToDelete) {
    const error = new HttpError("Stack for deletion not found", 404);
    return next(error);
  }
  try {
    // * same as in create stack, parallel operations
    // it deletes the stack and remove it from the user list of stacks
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await stackToDelete.remove({ session: sess });
    stackToDelete.createdBy.userStacks.pull(stackToDelete);
    await stackToDelete.createdBy.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Delete operation failed", 500);
    return next(error);
  }
  console.log("Deleted item: ", itemToDelete);
  res.status(200).json({ Deleted: itemToDelete });
}

// export of CRUD functions
exports.getStackByID = getStackByID;
exports.getStacksByUser = getStacksByUser;
exports.addNewStack = addNewStack;
exports.updateStack = updateStack;
exports.deleteStack = deleteStack;
