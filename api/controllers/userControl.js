// package import
// const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
// validation
const { validationResult } = require("express-validator");
// my validation
// const { validateEmail, validatePasswordInput } = require("../utils/validate");
const { checkInput } = require("../utils/checkInput");
// Utils
const findUser = require("../utils/findUser");
const hashPsw = require("../utils/hashPsw");
// model imports
const HttpError = require("../models/http_error");
const Stacks = require("../models/cardsModel");
const User = require("../models/userModel");
// Encryption & token
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sampleStack = require("../data/sampleCards.json");
const logger = require("../utils/logger");

async function getUserDataByID(req, res, next) {
  const userId = req.params.No;
  let returnUserData;
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
  // Express validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for user sign up", 422)
    );
  }
  // variable assignment from req
  const { userEmail, password, firstName, lastName } = req.body;
  // My validation
  if (checkInput(userEmail, password, firstName, lastName) !== true) {
    const error = new HttpError("Validation failed (error 49).", 500);
    return next(error);
  }
  // Checks user existence - user should not exist.
  if (findUser(userEmail) === true) {
    const error = new HttpError("This user exists already", 422);
    return next(error);
  }
  // Hashes password
  let hashedPsw = await hashPsw(password);
  if (hashedPsw === false || !hashedPsw) {
    const error = newHttpError("Problems with password (error 63).", 500);
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
  let firstStackID = userFirstStack._id;

  //
  // Save user & stack
  try {
    // * Parallel DB processes using session:
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userFirstStack.save({ session: sess });
    newUserToCreate.userStacks.push({
      stack_id: firstStackID,
      stack_name: userFirstStack.stackName,
    });
    await newUserToCreate.save({ session: sess });

    await sess.commitTransaction();
    //// *
  } catch (err) {
    const error = new HttpError("Error on user Sign up", 500);
    logger.error(
      "\n-------- Error: --------- \n",
      err,
      "\n----------------- \n"
    );
    return next(error);
  }
  // token -> sign up
  let token;
  try {
    token = jwt.sign({ user: newUserToCreate.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Error on token creation", 500);
    return next(error);
  }
  // Response
  res
    .status(201)
    .json({ user: newUserToCreate, email: userEmail, token: token });
}

async function logIn(req, res, next) {
  // get data from req
  const { userEmail, password } = req.body;
  let userExists;
  try {
    userExists = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Error on user log in (131).", 500);
    return next(error);
  }
  if (!userExists) {
    const error = new HttpError(
      "Sign up not possible: invalid credentials. Error 137.",
      401
    );
    return next(error);
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, userExists.password);
  } catch (err) {
    const error = new HttpError("Invalid credentials (148)", 500);
    return next(error);
  }

  if (!isValidPassword) {
    logger.info("invalid credentials");
    const error = new HttpError("Invalid credentials (154)", 500);
    return next(error);
  }
  // token -> log in
  let token;
  try {
    token = jwt.sign({ user: userExists.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Error on Log in. Error 48.", 500);
    return next(error);
  }
  res.status(200).json({
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
