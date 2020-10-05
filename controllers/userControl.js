// package import
const { v4: uuidv4 } = require("uuid");
// validation
const { validationResult } = require("express-validator");
// model imports
const HttpError = require("../models/http_error");
const User = require("../models/userModel");

const debugUserAPI = true;

let DUMMY_USER_LIST = [
  {
    userId: "jStein",
    userEmail: "jStein@literary.com",
    password: "test 1",
    userStacks: ["s001", "s003"],
    firstName: "John",
    lastName: "Steinbeck",
  },
  {
    userId: "ernHem",
    userEmail: "ernHem@literary.com",
    password: "test 2",
    userStacks: ["s002"],
    firstName: "Ernest",
    lastName: "Hemingway",
  },
];

function getUserById(req, res, next) {
  const userId = req.params.user;
  if (debugUserAPI) {
    console.log("GET request in User api for user:", userId);
  }
  const returnUserData = DUMMY_USER_LIST.find((u) => {
    return u.userId === userId;
  });
  if (!returnUserData) {
    throw new HttpError("no data found on User API", 404);
  } else {
    res.json(returnUserData);
  }
}

// * To be changed to: getUserStackNumbers
// function addUser(req, res, next) {
//   console.log(req.body);
//   const { userStacks, firstName, lastName } = req.body;
//   const newUserCreated = {
//     id: uuidv4(),
//     userStacks,
//     firstName,
//     lastName,
//     password,
//   };
//   DUMMY_USER_LIST.push(newUserCreated);
//   console.log("Received post, added", newUserCreated);
//   res.status(201).json({ added: newUserCreated });
// }
//TODO don't forget to add, later, the function that adds the
//TODO unique id to the list of stacks owned by users in the users json

async function signUp(req, res, next) {
  console.log("Sign up function");
  const { userEmail, password, firstName, lastName, userStacks } = req.body;
  ////* Sequence of checks ////
  // data validation
  const errors = validationResult(req);
  // is pre-validation ok?
  if (!errors.isEmpty()) {
    return next(
      new HttpError("error on data validation for user sign up", 422)
    );
  }
  /// is user listed already?
  let userExists;
  try {
    userExists = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Problems on user sign up", 500);
    return next(error);
  }
  // does it already exist?
  if (userExists) {
    const error = new HttpError("This user exists already", 422);
    return next(error);
  }
  ////* Makes and saves new user ///
  // Make new user
  const newUserToCreate = new User({
    userEmail,
    password,
    firstName,
    lastName,
    userStacks,
  });
  console.log("created: ", newUserToCreate);
  // Now save it
  try {
    await createdNewUser.save();
  } catch (err) {
    const error = new HttpError("Error on user sign up", 500);
    return next(error);
  }
  console.log("Added user: ", createdNewUser);
  res.status(201).json({ user: createdNewUser.toObejct({ getters: true }) });
}

function logIn(req, res, next) {
  console.log("Log in function");
  const { userEmail, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("error on data validation for user log in", 422);
  }
  const userListed = DUMMY_USER_LIST.find((u) => u.userEmail === userEmail);
  if (!userListed || userListed.password !== password) {
    throw new HttpError("User not identified", 401);
  }
  res.json({ message: "User logged in" });
}

exports.getUserById = getUserById;
// exports.addUser = addUser;
exports.signUp = signUp;
exports.logIn = logIn;
