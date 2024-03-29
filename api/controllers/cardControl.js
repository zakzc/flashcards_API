const mongoose = require("mongoose");
// model imports
const HttpError = require("../models/http_error");
const SetOfCards = require("../models/cardsModel");
const listOfUsers = require("../models/userModel");
// validation imports
const { validationResult } = require("express-validator");
// const mongooseUniqueValidator = require("mongoose-unique-validator");
// const { selectFields } = require("express-validator/src/select-fields");
const logger = require("../utils/logger");

async function getStackByID(req, res, next) {
  const stackId = req.params.No;
  let returnStack;
  try {
    returnStack = await SetOfCards.findById(stackId);
  } catch (err) {
    const error = new HttpError(
      "Error on getting stack by id. Error 20. ",
      500
    );
    return next(error);
  }
  if (!returnStack) {
    const error = new HttpError("no data found on Card API. Error 24.", 404);
    return next(error);
  } else {
    res.json(returnStack);
  }
}

async function getStacksByUser(req, res, next) {
  const creator = req.params.uid;
  let creatorStacks;
  try {
    // later, instead of createdBy, the search will be by user ID
    creatorStacks = await SetOfCards.find({ createdBy: uid });
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
  logger.info("Add New Stack");
  // validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for add stack request", 422)
    );
  }
  // assignment
  const { stackName, createdBy, cards } = req.body;
  logger.info("Request for: ", stackName, createdBy, cards);
  const newStackCreated = new SetOfCards({
    stackName,
    createdBy,
    cards,
  });
  let currentUser;
  try {
    // is the current user in memory already?
    currentUser = await listOfUsers.findById(createdBy);
  } catch (err) {
    const error = new HttpError("No current user: " + currentUser, 500);
    return next(error);
  }
  // is there any user logged in?
  if (!currentUser) {
    const error = new HttpError("No user logged in or user doesn't exist", 404);
    return next(error);
  }
  // saving process
  let newStackToUser = {
    stack_id: newStackCreated._id,
    stack_name: newStackCreated.stackName,
  };
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
    logger.error("-------- Error: --------- \n", err);
    return next(error);
  }

  res.status(201).json({ stack: newStackCreated });
}

async function updateStack(req, res, next) {
  // data validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for update request", 422)
    );
  }
  const { _id, stackName, createdBy, cards } = req.body;
  let updatedStack;
  try {
    updateStack = await SetOfCards.findById(_id);
  } catch (err) {
    const error = new HttpError(
      "Could not update place. Place not found.",
      500
    );
    return next(error);
  }
  try {
    if (stackName) {
      updateStack.stackName = stackName;
    }
    if (createdBy) {
      updateStack.createdBy = createdBy;
    }
    if (cards) {
      updateStack.cards = cards;
    }
  } catch (err) {
    const error = new HttpError(
      "Expected data, but received nothing or undefined (error 152)",
      err,
      500
    );
    return error;
  }
  try {
    await updateStack.save();
  } catch (err) {
    const error = new HttpError("Update operation failed", 500);
    return next(error);
  }
  res.status(200).json({ Updated: updateStack.toObject({ getters: true }) });
}

async function deleteStack(req, res, next) {
  // stack data
  const itemToDelete = req.params.No;
  let stackToDelete;
  // user data
  let currentUser;
  let stackIndexNo;
  ///
  /// * Check data integrity
  ///
  try {
    stackToDelete = await SetOfCards.findById(itemToDelete).populate(
      "createdBy"
    );
  } catch (err) {
    const error = new HttpError("Could not find item to delete.", 500);
    return next(error);
  }
  if (!stackToDelete) {
    const error = new HttpError("Stack for deletion not found", 404);
    return next(error);
  }
  // Stack to delete is necessary to find user data
  currentUser = await listOfUsers.findById(stackToDelete.createdBy);
  stackIndexNo = currentUser.userStacks.findIndex(
    (i) => i.stack_id == stackToDelete._id
  );
  logger.info(
    "------------ \n---Received:---\n ===Stack===\n ",
    stackToDelete,
    "\n===User===\n",
    currentUser,
    "\n===Index to delete===\n ",
    stackIndexNo
  );

  /// * executes stack delete
  ///
  try {
    // it deletes the stack and remove it from the user list of stacks
    //* Transaction
    //////////////
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Delete Stack
    try {
      await stackToDelete.remove({ session: sess });
      await stackToDelete.createdBy.save({ session: sess });
    } catch (err) {
      const error = new HttpError(
        "Delete operation failed for stack deletion",
        500
      );
      logger.error("=== Error ===", err);
      return next(error);
    }
    ///
    // Delete stack from user's list of stacks
    try {
      await currentUser.userStacks[stackIndexNo].remove({ session: sess });
      await currentUser.save({ session: sess });
    } catch (err) {
      const error = new HttpError(
        "Delete operation failed for update user's list of stacks.",
        500
      );
      logger.error("=== Error ===", err);
      return next(error);
    }
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Delete operation failed", 500);
    logger.error("=== Error ===", err);
    return next(error);
  }
  // * end of transaction
  ///
  res.status(200).json({ Deleted: itemToDelete });
}

// This function is for test and refactor only. De-habilitated on production.
// async function getAllStacks(req, res, next) {
//   const list = await SetOfCards.find().sort();
//   res.status(200).send(list);
// }

// export of CRUD functions
exports.getStackByID = getStackByID;
exports.getStacksByUser = getStacksByUser;
exports.addNewStack = addNewStack;
exports.updateStack = updateStack;
exports.deleteStack = deleteStack;
// exports.getAllStacks = getAllStacks;
