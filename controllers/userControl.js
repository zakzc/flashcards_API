// package import
// const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
// validation
const { validationResult } = require("express-validator");
// model imports
const HttpError = require("../models/http_error");
const Stacks = require("../models/cardsModel");
const User = require("../models/userModel");
// Encryption & token
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sampleStack = require("../data/sampleCards.json");

async function getUserDataByID(req, res, next) {
  const userId = req.params.No;
  let returnUserData;
  // console.log("Request for data from user");
  try {
    returnUserData = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Error on getting user Data by id: ", 500);
    return next(error);
  }
  if (!returnUserData) {
    const error = new HttpError("no data found on User API", 404);
    return next(error);
  } else {
    res.json(returnUserData.toObject({ getters: true }));
  }
}

async function signUp(req, res, next) {
  ////* Sequence of checks ////
  // data validation
  const errors = validationResult(req);
  // is pre-validation ok?
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for user sign up", 422)
    );
  }
  // variable assignment from req
  const { userEmail, password, firstName, lastName } = req.body;

  // * Checks user
  /// is user listed already?
  let doesUserExist;
  try {
    doesUserExist = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Problems on user sign up", 500);
    return next(error);
  }
  // does it already exist?
  if (doesUserExist) {
    const error = new HttpError("This user exists already", 422);
    return next(error);
  }

  // * Checks password
  // hashes password
  let hashedPsw;
  try {
    hashedPsw = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = newHttpError("could not create user, please try again", 500);
    return next(error);
  }
  ////* Makes and saves new user ///

  // Make new user
  let newUserToCreate = new User({
    userEmail,
    password: hashedPsw,
    firstName,
    lastName,
    userStacks: [],
  });
  // Make the user's first stack
  let userFirstStack = new Stacks({
    stackName: "Sample Stack",
    createdBy: newUserToCreate._id,
    cards: sampleStack,
  });
  console.log("stack: ", userFirstStack);
  let firstStackID = userFirstStack._id;
  console.log("Should be: ", firstStackID, userFirstStack._id);
  //
  // Save user & stack
  try {
    // * Parallel DB processes using session:
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // TODO Check because it should only add the stack id to userStacks and the whole stack to stacks.
    await userFirstStack.save({ session: sess });
    newUserToCreate.userStacks.push({
      stack_id: firstStackID,
      stack_name: userFirstStack.stackName,
    });
    await newUserToCreate.save({ session: sess });

    await sess.commitTransaction();
    //// *
    // newUserToCreate.save();
    // userFirstStack.save({ session: sess });
  } catch (err) {
    const error = new HttpError("Error on user Sign up", 500);
    console.log(
      "\n-------- Error: --------- \n",
      err,
      "\n----------------- \n"
    );
    return next(error);
  }
  console.log("Created: ", newUserToCreate);

  // Save stack
  // userFirstStack.save();
  // token -> sign up
  let token;
  try {
    token = jwt.sign({ user: newUserToCreate.id }, "initial_secret", {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Error on token creation", 500);
    return next(error);
  }

  // and return
  // console.log("Sign up of user: ", newUserToCreate);
  res
    .status(201)
    .json({ user: newUserToCreate, email: userEmail, token: token });
}

async function logIn(req, res, next) {
  console.log("Log in requested for: ", req.body);
  // get data from req
  const { userEmail, password } = req.body;
  // console.log("received request: ", userEmail, password);
  let userExists;
  try {
    userExists = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Error on user log in. Error 147.", 500);
    return next(error);
  }
  if (!userExists) {
    const error = new HttpError(
      "Sign up not possible: invalid credentials. Error 152.",
      401
    );
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userExists.password);
  } catch (err) {
    const error = new HttpError("Invalid credentials", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials", 500);
    return next(error);
  }

  let logInUser;
  logInUser = await User.findOne({ userEmail: userEmail });

  // token -> log in
  let token;
  try {
    token = jwt.sign({ user: userExists.id }, "initial_secret", {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Error on Log in. Error 48.", 500);
    return next(error);
  }

  res.json({
    userId: userExists.id,
    email: userExists.userEmail,
    firstName: userExists.firstName,
    lastName: userExists.lastName,
    token: token,
    userStacks: userExists.userStacks,
  });
}

// exports.getUserById = getUserById;
exports.getUserDataByID = getUserDataByID;
// exports.addUser = addUser;
exports.signUp = signUp;
exports.logIn = logIn;
