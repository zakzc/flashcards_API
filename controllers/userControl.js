// package import
const { v4: uuidv4 } = require("uuid");
// validation
const { validationResult } = require("express-validator");
// model imports
const HttpError = require("../models/http_error");
const User = require("../models/userModel");

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

// To be updated
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
  const { userEmail, password, firstName, lastName, userStacks } = req.body;
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
    await newUserToCreate.save();
    console.log("Sign up: ", newUserToCreate);
  } catch (err) {
    const error = new HttpError("Error on user sign up", 500);
    return next(error);
  }
  // and return
  res.status(201).json({ user: newUserToCreate.toObject({ getters: true }) });
}

async function logIn(req, res, next) {
  console.log("Log in function");
  // get data from req
  const { userEmail, password } = req.body;
  let userExists;
  try {
    userExists = await User.findOne({ userEmail: userEmail });
  } catch (err) {
    const error = new HttpError("Problems on user log in", 500);
    return next(error);
  }
  // validate req
  // const errors = validationResult(req);
  // checks
  // if (!errors.isEmpty()) {
  //   const error = new HttpError(
  //     "error on data validation for user log in",
  //     422
  //   );
  //   return next(error);
  // }
  // previous
  // const userListed = DUMMY_USER_LIST.find((u) => u.userEmail === userEmail);
  if (!userExists || userExists.password !== password) {
    const error = new HttpError(
      "Sign up not possible: invalid credentials",
      401
    );
    return next(error);
  }
  res.json({ message: "User: " + userEmail + " logged in" });
}

exports.getUserById = getUserById;
// exports.addUser = addUser;
exports.signUp = signUp;
exports.logIn = logIn;
