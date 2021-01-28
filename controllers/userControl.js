// package import
// const { v4: uuidv4 } = require("uuid");
// validation
const { validationResult } = require("express-validator");
// model imports
const HttpError = require("../models/http_error");
const User = require("../models/userModel");
// Encryption & token
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  ////* Makes and saves new user ///

  // Dealing with password
  try {
    let hashedPsw = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = newHttpError("could not create user, please try again", 500);
    return next(error);
  }

  // Make new user
  const newUserToCreate = new User({
    userEmail,
    password: hashedPsw,
    firstName,
    lastName,
    userStacks: [],
  });
  // console.log("created: ", newUserToCreate);
  // Now save it
  try {
    await newUserToCreate.save();
    // console.log("Sign up: ", newUserToCreate);
  } catch (err) {
    const error = new HttpError("Error on user sign up", 500);
    return next(error);
  }

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
  // console.log("Log in");
  // get data from req
  const { userEmail, password } = req.body;
  // console.log("received request: ", userEmail, password);
  let userExists;
  try {
    userExists = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Problems on user log in", 500);
    return next(error);
  }
  if (!userExists) {
    const error = new HttpError(
      "Sign up not possible: invalid credentials",
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

  let logInUser = await User.findOne({ userEmail: userEmail }, "password");

  // token -> log in
  let token;
  try {
    token = jwt.sign({ userId: newUserToCreate.id }, "initial_secret", {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError("Error on Log in", 500);
    return next(error);
  }

  // connection
  res.json({
    userId: userExists.id,
    email: userEmail,
    token: token,
  });
}

// exports.getUserById = getUserById;
exports.getUserDataByID = getUserDataByID;
// exports.addUser = addUser;
exports.signUp = signUp;
exports.logIn = logIn;
